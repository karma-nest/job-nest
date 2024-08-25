/**
 * @fileoverview
 * @version
 * @module
 */
import { TokenExpiredError } from 'jsonwebtoken';
import { notificationConfig } from '../configs';
import { AuthTemplate } from '../templates';
import { redis } from '../libs';
import {
  AdminHelper,
  CandidateHelper,
  RecruiterHelper,
  UserHelper,
} from '../helpers';
import {
  CreateErrorUtil,
  JwtUtil,
  NotificationUtil,
  passwordUtil,
} from '../utils';
import {
  IAdminRegister,
  ICandidateRegister,
  IRecruiterRegister,
  IAdmin,
  ICandidate,
  IRecruiter,
  IUser,
  IJwtToken,
} from '../interfaces';

export default class AuthService {
  private readonly moduleName: string;

  // Helper
  private readonly adminHelper: AdminHelper;
  private readonly candidateHelper: CandidateHelper;
  private readonly recruiterHelper: RecruiterHelper;
  private readonly userHelper: UserHelper;

  // Templates
  private readonly authTemplates: AuthTemplate;

  // Utils
  private readonly errorUtil: CreateErrorUtil;
  private readonly jwtUtil: JwtUtil;
  private readonly notificationUtil: NotificationUtil;

  /**
   * Verifies the access token and refreshes it if needed.
   * @param {IUser} user - The user object.
   * @param {string | null} accessToken - The access token to verify.
   * @param {string} cacheKey - The cache key for storing the token.
   * @returns {Promise<{ accessToken: string | null }>} - The new access token if refreshed, otherwise the same token.
   */
  private verifyAndRefreshToken = async (
    user: IUser,
    accessToken: string | null,
    cacheKey: string
  ): Promise<{ accessToken: string | null }> => {
    if (!accessToken) {
      return await this.handleTokenRefresh(user, cacheKey);
    }

    return await this.verifyTokenAndRefreshIfNeeded(
      user,
      accessToken,
      cacheKey
    );
  };

  /**
   * Generates and caches a new refresh token.
   * @param {IUser} user - The user object.
   * @param {string} cacheKey - The cache key for storing the token.
   * @returns {Promise<{ accessToken: string | null }>} - The new access token.
   * @throws {Error} - If generating the refresh token fails.
   */
  private handleTokenRefresh = async (
    user: IUser,
    cacheKey: string
  ): Promise<{ accessToken: string | null }> => {
    try {
      const refreshToken = await this.generateAndCacheRefreshToken(
        user,
        cacheKey
      );
      return { accessToken: refreshToken };
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  };

  /**
   * Verifies the access token and refreshes it if it is expired.
   * @param {IUser} user - The user object.
   * @param {string} accessToken - The access token to verify.
   * @param {string} cacheKey - The cache key for storing the token.
   * @returns {Promise<{ accessToken: string | null }>} - The new access token if refreshed, otherwise the same token.
   */
  private verifyTokenAndRefreshIfNeeded = (
    user: IUser,
    accessToken: string,
    cacheKey: string
  ): Promise<{ accessToken: string | null }> => {
    return new Promise<{ accessToken: string | null }>((resolve, reject) => {
      this.jwtUtil.verifyJwtToken(
        {
          role: user.role,
          tokenType: 'accessToken',
          jwtToken: accessToken,
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async (verifyError, decodedToken) => {
          if (verifyError) {
            if (verifyError instanceof TokenExpiredError) {
              try {
                const refreshToken = await this.generateAndCacheRefreshToken(
                  user,
                  cacheKey
                );
                resolve({ accessToken: refreshToken });
              } catch (error) {
                reject(
                  new Error(
                    `Failed to generate refresh token: ${error.message}`
                  )
                );
              }
            } else {
              reject(
                new Error(`Token verification failed: ${verifyError.message}`)
              );
            }
          } else {
            resolve({ accessToken });
          }
        }
      );
    });
  };

  /**
   * Generates and caches a new JWT refresh token.
   * @param {IUser} user - The user object.
   * @param {string} cacheKey - The cache key for storing the refreshed token.
   * @returns {Promise<string>} - A promise resolving to the new refresh token.
   */
  private generateAndCacheRefreshToken = async (
    user: IUser,
    cacheKey: string
  ): Promise<string> => {
    const refreshToken = await new Promise<string>((resolve, reject) => {
      this.jwtUtil.generateJwtToken(
        {
          id: user.id,
          role: user.role,
          type: 'accessToken',
        },
        (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token);
          }
        }
      );
    });

    await redis.set(cacheKey, refreshToken);
    return refreshToken;
  };

  /**
   * Creates a role-specific user based on the provided role.
   *
   * @param {Partial<IUser>} newUser - The new user information including the role.
   * @param {Partial<IAdmin | ICandidate | IRecruiter>} userData - Additional user data specific to the role.
   * @throws {InternalServerError} If the user role is invalid.
   */
  private createRoleSpecificUser = async (
    newUser: Partial<IUser>,
    userData: IAdmin | ICandidate | IRecruiter
  ): Promise<void> => {
    if (!newUser.role) {
      throw this.errorUtil.createInternalServerError('User role is missing.', {
        module: this.moduleName,
        method: 'createRoleSpecificUser',
        trace: {
          error: 'Missing role',
          log: newUser['email'],
        },
      });
    }

    switch (newUser.role) {
      case 'admin':
        await this.adminHelper.createAdmin({
          ...(userData as IAdmin),
          userId: newUser?.id,
        });
        break;
      case 'candidate':
        await this.candidateHelper.createCandidate({
          ...(userData as ICandidate),
          userId: newUser?.id,
        });
        break;
      case 'recruiter':
        await this.recruiterHelper.createRecruiter({
          ...(userData as IRecruiter),
          userId: newUser?.id,
        });
        break;
      default:
        throw this.errorUtil.createInternalServerError('Invalid user role.', {
          module: this.moduleName,
          method: 'createRoleSpecificUser',
          trace: {
            error: `Invalid user role: ${newUser?.role}`,
            log: newUser['email'],
          },
        });
    }
  };

  constructor() {
    this.moduleName = 'auth.service';
    this.authTemplates = new AuthTemplate();
    this.adminHelper = new AdminHelper();
    this.candidateHelper = new CandidateHelper();
    this.userHelper = new UserHelper();
    this.recruiterHelper = new RecruiterHelper();
    this.errorUtil = new CreateErrorUtil();
    this.jwtUtil = new JwtUtil();
    this.notificationUtil = new NotificationUtil();
  }

  /**
   * Registers a new user and sends an activation email.
   * @param {'admin' | 'candidate' | 'recruiter'} role - The role of the user.
   * @param {IAdminRegister | ICandidateRegister | IRecruiterRegister} registerCreds - The registration credentials.
   * @returns {Promise<{ message: string }>} - A promise resolving to an object containing a success message.
   * @throws Will throw an error if the registration or email sending process fails.
   */
  public register = async (
    role: 'admin' | 'candidate' | 'recruiter',
    registerCreds: IAdminRegister | ICandidateRegister | IRecruiterRegister
  ): Promise<{ message: string }> => {
    // Fetch user document from the database and check if it already exists
    const foundUser = await this.userHelper.getUser({
      email: registerCreds['email'],
    });
    if (foundUser) {
      console.info(foundUser);
      throw this.errorUtil.createBadRequestError(
        'Sorry, an account with this email already exists.',
        {
          module: this.moduleName,
          method: 'register',
          trace: {
            error: 'User document already exists.',
            log: registerCreds['email'],
          },
        }
      );
    }

    const hashedPassword = await passwordUtil.hashPassword(
      registerCreds['confirmPassword'],
      role
    );
    const userCreds = {
      email: registerCreds['email'],
      mobileNumber: registerCreds['phoneNumber'],
      password: hashedPassword,
      role,
    };

    try {
      const newUser = await this.userHelper.createUser(userCreds);
      await this.createRoleSpecificUser(newUser, registerCreds);
      const payload = {
        id: newUser['id'],
        role: newUser['role'],
        type: 'activationToken',
      };

      const generateJwtTokenAsync = (payload: IJwtToken): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
          this.jwtUtil.generateJwtToken(payload, (error, token) => {
            if (error) {
              reject(error);
            } else {
              resolve(token);
            }
          });
        });
      };

      const activationToken = await generateJwtTokenAsync(payload);

      await new Promise<void>((resolve, reject) => {
        this.notificationUtil.sendEmail(
          newUser.email,
          `Welcome Aboard! Activate Your ${notificationConfig.mailgen.product.name} Account`,
          this.authTemplates.activateAccount(newUser.email, activationToken),
          (sendEmailError) => {
            if (sendEmailError) {
              reject(
                this.errorUtil.createInternalServerError(
                  'We ran into an issue while creating your account.',
                  {
                    module: this.moduleName,
                    method: 'register',
                    trace: {
                      error: `Failed to send account activation email: ${registerCreds['email']}`,
                      log: sendEmailError,
                    },
                  }
                )
              );
            } else {
              resolve();
            }
          }
        );
      });

      return {
        message:
          'An activation link has been sent to the email associated with your account.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while creating your account.',
        {
          module: this.moduleName,
          method: 'register',
          trace: {
            error: `Failed to create ${role} account.`,
            log: error?.message || error,
          },
        }
      );
    }
  };

  /**
   * Handles the login functionality.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<{ accessToken: string }>} - A promise resolving to an object containing the access token.
   * @throws Will throw an error if login fails.
   */
  public login = async (
    email: string,
    password: string
  ): Promise<{ accessToken: string }> => {
    const foundUser = await this.userHelper.getUser({ email });
    if (!foundUser) {
      throw this.errorUtil.createValidationError(
        'Invalid username or password.',
        {
          module: this.moduleName,
          method: 'login',
          trace: {
            error: 'User document not found',
            log: email,
          },
        }
      );
    }

    if (!foundUser.isVerified) {
      throw this.errorUtil.createBadRequestError(
        'Please verify your account to continue.',
        {
          module: this.moduleName,
          method: 'login',
          trace: {
            error: 'User account not verified.',
            log: email,
          },
        }
      );
    }

    const passwordsMatch = await passwordUtil.comparePassword(
      password,
      foundUser['password'],
      foundUser['role']
    );
    if (!passwordsMatch) {
      throw this.errorUtil.createValidationError(
        'Invalid username or password.',
        {
          module: this.moduleName,
          method: 'login',
          trace: {
            error: 'User password is invalid.',
            log: email,
          },
        }
      );
    }
    try {
      const cacheKey = `access_token:${foundUser.id}`;
      const cachedAccessToken = await redis.get(cacheKey);

      const accessToken = await this.verifyAndRefreshToken(
        foundUser,
        cachedAccessToken,
        cacheKey
      );

      return accessToken;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while logging in. Please try again.',
        {
          module: this.moduleName,
          method: 'login',
          trace: {
            error: 'Failed to login user.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  /**
   * Logs out the user by deleting the cached access token.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<void>} - A promise that resolves when the user is logged out.
   * @throws Will throw an error if logout fails.
   */
  public logout = async (userId: number): Promise<void> => {
    const cacheKey = `access_token:${userId}`;
    try {
      const cachedAccessToken = await redis.get(cacheKey);

      if (!cachedAccessToken) {
        throw this.errorUtil.createBadRequestError(
          'We ran into an issue while logging out. Please try again.',
          {
            module: this.moduleName,
            method: 'logout',
            trace: {
              error: 'Cached access token not found.',
              log: userId,
            },
          }
        );
      }

      await redis.del(cacheKey);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while logging out. Please try again.',
        {
          module: this.moduleName,
          method: 'logout',
          trace: {
            error: 'Failed to log out user.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  /**
   * Handles the forgot password functionality.
   * @param {string} email - The email of the user.
   * @returns {Promise<{ message: string }>} - A promise resolving to an object containing the message.
   * @throws Will throw an error if the process fails.
   */
  public forgotPassword = async (
    email: string
  ): Promise<{ message: string }> => {
    const foundUser = await this.userHelper.getUser({ email });
    if (!foundUser) {
      throw this.errorUtil.createNotFoundError(
        'Account associated with email not found.',
        {
          module: this.moduleName,
          method: 'forgotPassword',
          trace: {
            error: 'User document not found.',
            log: email,
          },
        }
      );
    }

    if (!foundUser.isVerified) {
      throw this.errorUtil.createBadRequestError(
        'Please verify your account to continue.',
        {
          module: this.moduleName,
          method: 'forgotPassword',
          trace: {
            error: 'User account not verified.',
            log: email,
          },
        }
      );
    }

    const generateJwtTokenAsync = (payload: IJwtToken): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        this.jwtUtil.generateJwtToken(payload, (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token);
          }
        });
      });
    };

    const payload: IJwtToken = {
      id: foundUser.id,
      role: foundUser.role,
      type: 'passwordToken',
    };
    try {
      const passwordToken = await generateJwtTokenAsync(payload);
      const cacheKey = `password_token:${foundUser.id}`;

      await new Promise<void>((resolve, reject) => {
        this.notificationUtil.sendEmail(
          foundUser.email,
          `${notificationConfig.mailgen.product.name} account password reset`,
          this.authTemplates.forgotPassword(
            foundUser.email,
            passwordToken,
            foundUser.role
          ),
          (sendEmailError) => {
            if (sendEmailError) {
              reject(
                this.errorUtil.createInternalServerError(
                  'We ran into an issue while sending the password reset link. Please try again.',
                  {
                    module: this.moduleName,
                    method: 'forgotPassword',
                    trace: {
                      error: `Failed to send account activation email: ${foundUser['email']}`,
                      log: sendEmailError,
                    },
                  }
                )
              );
            } else {
              resolve();
            }
          }
        );
      });

      await redis.set(cacheKey, passwordToken);
      return {
        message:
          'A password reset link has been sent to the email associated with your account.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while sending the password reset link. Please try again.',
        {
          module: this.moduleName,
          method: 'forgotPassword',
          trace: {
            error: 'Failed to send reset link.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  /**
   * Resets the user's password.
   * @param {number} userId - The ID of the user whose password is to be reset.
   * @param {Object} passwordQuery - An object containing the new password and confirmation password.
   * @param {string} passwordQuery.newPassword - The new password.
   * @param {string} passwordQuery.confirmPassword - The confirmation of the new password.
   * @returns {Promise<{ message: string }>} - A promise resolving to an object containing the message.
   * @throws Will throw an error if the process fails.
   */
  public resetPassword = async (
    userId: number,
    newPassword: string
  ): Promise<{ message: string }> => {
    // Retrieve the user from the database
    const foundUser = await this.userHelper.getUser({ id: userId });
    if (!foundUser) {
      throw this.errorUtil.createNotFoundError(
        'We ran into an issue while resetting password. Please try again.',
        {
          module: this.moduleName,
          method: 'resetPassword',
          trace: {
            error: 'User document not found.',
            log: userId,
          },
        }
      );
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await passwordUtil.comparePassword(
      newPassword,
      foundUser['password'],
      foundUser['role']
    );
    if (isSamePassword) {
      throw this.errorUtil.createBadRequestError(
        'Sorry, new password cannot be the same as the old password.',
        {
          module: this.moduleName,
          method: 'resetPassword',
          trace: {
            error: 'User new password same as old password.',
            log: userId || foundUser.email,
          },
        }
      );
    }

    // Hash the new password
    const hashedPassword = await passwordUtil.hashPassword(
      newPassword,
      foundUser['role']
    );
    const cacheKey = `password_token:${foundUser.id}`;

    try {
      // Update the user's password
      await this.userHelper.updateUser(foundUser.id, {
        password: hashedPassword,
      });

      await redis.del(cacheKey);
      // Send confirmation email
      await new Promise<void>((resolve) => {
        this.notificationUtil.sendEmail(
          foundUser.email,
          `${notificationConfig.mailgen.product.name} account password change`,
          this.authTemplates.passwordUpdate(foundUser.email, {
            ip: '127.0.0.1',
            timestamp: Date()
              .toString()
              .replace(/\s\(.*\)$/, ''),
          }),
          () => {
            resolve();
          }
        );
      });

      return {
        message: 'Password reset successful. Please login to continue.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while resetting the password. Please try again.',
        {
          module: this.moduleName,
          method: 'resetPassword',
          trace: {
            error: 'Failed to update password or send confirmation email.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  /**
   * Requests an activation link for a user's account.
   * @param {string} email - The email of the user.
   * @returns {Promise<{ message: string }>} - A promise resolving to an object containing the message.
   * @throws Will throw an error if the process fails.
   */
  public requestActivation = async (
    email: string
  ): Promise<{ message: string }> => {
    // Retrieve the user from the database
    const foundUser = await this.userHelper.getUser({ email });
    if (!foundUser) {
      throw this.errorUtil.createNotFoundError(
        'Account associated with email not found.',
        {
          module: this.moduleName,
          method: 'requestActivation',
          trace: {
            error: 'User document not found.',
            log: email,
          },
        }
      );
    }

    // Check if the user account is already verified
    if (foundUser.isVerified) {
      throw this.errorUtil.createBadRequestError(
        'Account already verified. Login to continue.',
        {
          module: this.moduleName,
          method: 'requestActivation',
          trace: {
            error: 'User account verified.',
            log: email,
          },
        }
      );
    }

    // Generate activation token
    const payload: IJwtToken = {
      id: foundUser.id,
      role: foundUser.role,
      type: 'activationToken',
    };

    // Wrap the callback-based `generateJwtToken` in a Promise
    const generateJwtTokenAsync = (payload: IJwtToken): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        this.jwtUtil.generateJwtToken(payload, (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token);
          }
        });
      });
    };

    try {
      const activationToken = await generateJwtTokenAsync(payload);
      const cacheKey = `activation_token:${foundUser.id}`;

      await redis.set(cacheKey, activationToken);
      // Send activation email
      await new Promise<void>((resolve, reject) => {
        this.notificationUtil.sendEmail(
          foundUser.email,
          `Welcome Aboard! Activate Your ${notificationConfig.mailgen.product.name} Account`,
          this.authTemplates.activateAccount(foundUser.email, activationToken),
          (sendEmailError) => {
            if (sendEmailError) {
              reject(
                this.errorUtil.createInternalServerError(
                  'We ran into an issue while sending the account activation link. Please try again.',
                  {
                    module: this.moduleName,
                    method: 'requestActivation',
                    trace: {
                      error: 'Failed to send activation email.',
                      log: sendEmailError,
                    },
                  }
                )
              );
            } else {
              resolve();
            }
          }
        );
      });

      return {
        message:
          'An activation link has been sent to the email associated with your account.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'We ran into an issue while sending the account activation link. Please try again.',
        {
          module: this.moduleName,
          method: 'requestActivation',
          trace: {
            error: 'Failed to send activation email.',
            log: error?.message || error,
          },
        }
      );
    }
  };

  /**
   * Confirms and activates a user's account.
   * @param {number} userId - The ID of the user whose account is to be activated.
   * @returns {Promise<{ message: string }>} - A promise resolving to an object containing the success message.
   * @throws Will throw an error if the process fails.
   */
  public confirmActivation = async (
    userId: number
  ): Promise<{ message: string }> => {
    // Retrieve the user from the database
    const foundUser = await this.userHelper.getUser({ id: userId });
    if (!foundUser) {
      throw this.errorUtil.createBadRequestError(
        'Account verification failed. Please try again.',
        {
          module: this.moduleName,
          method: 'confirmActivation',
          trace: {
            error: 'User document not found.',
            log: userId,
          },
        }
      );
    }

    const cacheKey = `activation_token:${foundUser.id}`;

    try {
      // Update the user's verification status
      await this.userHelper.updateUser(userId, { isVerified: true });
      await redis.del(cacheKey);
      return {
        message: 'Account successfully verified. You can now login.',
      };
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'Account verification failed. Please try again.',
        {
          module: this.moduleName,
          method: 'confirmActivation',
          trace: {
            error: 'Failed to activate account.',
            log: error?.message || error,
          },
        }
      );
    }
  };
}
