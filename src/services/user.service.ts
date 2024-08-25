/**
 * @fileoverview This module defines the UserService class, responsible for managing user-related operations such as updating contact details and passwords.
 * @module UserService
 * @version 1.0.0
 */

import { AuthTemplate } from '../templates';
import { UserHelper } from '../helpers';
import {
  CreateErrorUtil,
  CustomAPIError,
  NotificationUtil,
  passwordUtil,
} from '../utils';
import { IUpdateContactQuery, IUpdatePasswordQuery } from '../interfaces';
import { notificationConfig } from '../configs';

export default class UserService {
  private readonly moduleName: string;
  private readonly errorUtil: CreateErrorUtil;
  private readonly notificationUtil: NotificationUtil;
  private readonly userHelper: UserHelper;
  private readonly authTemplate: AuthTemplate;

  /**
   * Constructs an instance of UserService.
   * @param {string} moduleName - The name of the module for logging and error tracking.
   */
  constructor(moduleName: string) {
    this.moduleName = `${moduleName}.controller`;
    this.errorUtil = new CreateErrorUtil();
    this.notificationUtil = new NotificationUtil();
    this.userHelper = new UserHelper();
    this.authTemplate = new AuthTemplate();
  }

  /**
   * Updates the contact details of a user.
   * @param {number} userId - The ID of the user whose contact details are being updated.
   * @param {IUpdateContactQuery} updateContactQuery - The contact details to update.
   * @throws {NotFoundError} If the user is not found.
   * @throws {InternalServerError} If an unexpected error occurs during the update.
   * @returns {Promise<void>} A promise that resolves when the contact details are successfully updated.
   */
  public updateContactDetails = async (
    userId: number,
    updateContactQuery: IUpdateContactQuery
  ): Promise<void> => {
    try {
      const foundUser = await this.userHelper.getUser({ id: userId });
      if (!foundUser) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while updating contact details.',
          {
            module: this.moduleName,
            method: 'updateContactDetails',
            trace: {
              error: 'User account not found.',
              log: userId,
            },
          }
        );
      }

      await this.userHelper.updateUser(foundUser['id'], updateContactQuery);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'Failed to update user contact information.',
        {
          module: this.moduleName,
          method: 'updateContactDetails',
          trace: {
            error: error.message,
            log: userId,
          },
        }
      );
    }
  };

  /**
   * Updates the password of a user.
   * @param {number} userId - The ID of the user whose password is being updated.
   * @param {IUpdatePasswordQuery} updatePasswordQuery - The current, new, and confirmed passwords.
   * @throws {NotFoundError} If the user is not found.
   * @throws {UnauthorizedError} If the current password is incorrect or if the new password matches the current password.
   * @throws {InternalServerError} If an unexpected error occurs during the update.
   * @returns {Promise<void>} A promise that resolves when the password is successfully updated.
   */
  public updatePassword = async (
    userId: number,
    updatePasswordQuery: IUpdatePasswordQuery
  ): Promise<void> => {
    try {
      const foundUser = await this.userHelper.getUser({ id: userId });
      if (!foundUser) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while updating password.',
          {
            module: this.moduleName,
            method: 'updatePassword',
            trace: {
              error: 'User account not found.',
              log: userId,
            },
          }
        );
      }

      const isCurrentPasswordValid = await passwordUtil.comparePassword(
        updatePasswordQuery['currentPassword'],
        foundUser['password'],
        foundUser['role']
      );
      if (!isCurrentPasswordValid) {
        throw this.errorUtil.createUnauthorizedError(
          'Current password is incorrect.',
          {
            module: this.moduleName,
            method: 'updatePassword',
            trace: {
              error: 'User current password is incorrect.',
              log: userId,
            },
          }
        );
      }

      const isConfirmAndHashedPasswordSame = await passwordUtil.comparePassword(
        updatePasswordQuery.confirmPassword,
        foundUser['password'],
        foundUser['role']
      );
      if (isConfirmAndHashedPasswordSame) {
        throw this.errorUtil.createUnauthorizedError(
          'New password cannot be the same as the current password.',
          {
            module: this.moduleName,
            method: 'updatePassword',
            trace: {
              error: 'User new and hashed passwords match.',
              log: userId,
            },
          }
        );
      }

      const hashedPassword = await passwordUtil.hashPassword(
        updatePasswordQuery['confirmPassword'],
        foundUser['role']
      );
      await this.userHelper.updateUser(foundUser['id'], {
        password: hashedPassword,
      });

      await new Promise<void>(() => {
        this.notificationUtil.sendEmail(
          foundUser.email,
          `${notificationConfig.mailgen.product.name} account password update`,
          this.authTemplate.passwordUpdate(foundUser.email, {
            ip: '127.0.0.1',
            timestamp: new Date().toISOString(),
          }),
          () => {
            // Placeholder for actual email sending callback logic.
          }
        );
      });
    } catch (error) {
      if (error instanceof CustomAPIError) {
        throw error;
      }
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while updating password.',
        {
          module: this.moduleName,
          method: 'updatePassword',
          trace: {
            error: error.message,
            log: userId,
          },
        }
      );
    }
  };

  /**
   * Removes a user's account.
   * @param {number} userId - The ID of the user whose account is being removed.
   * @throws {NotFoundError} If the user is not found.
   * @throws {InternalServerError} If an unexpected error occurs during the removal.
   * @returns {Promise<void>} A promise that resolves when the account is successfully removed.
   */
  public removeAccount = async (userId: number): Promise<void> => {
    try {
      const foundUser = await this.userHelper.getUser({ id: userId });

      if (!foundUser) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while removing the account.',
          {
            module: this.moduleName,
            method: 'removeAccount',
            trace: {
              error: 'User account not found.',
              log: userId,
            },
          }
        );
      }

      await this.userHelper.removeUser(foundUser.id);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while removing the account.',
        {
          module: this.moduleName,
          method: 'removeAccount',
          trace: {
            error: error.message,
            log: userId,
          },
        }
      );
    }
  };
}
