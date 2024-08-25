/**
 * @fileoverview Authorization Middleware for handling access control.
 * @version 1.0.0
 * @module authorizationMiddleware
 */
import { NextFunction, Request, Response } from 'express';
import { JwtUtil, ResponseUtil } from '../utils';
import { notificationConfig } from '../configs';
import { AuthenticationMiddleware } from './';
import { compareStrings } from '../validators';

/**
 * Middleware class for handling authorization.
 * @class AuthorizationMiddleware
 * @extends {ResponseUtil}
 */
export default class AuthorizationMiddleware extends ResponseUtil {
  private readonly jwtUtil: JwtUtil;
  private readonly authenticationMiddleware: AuthenticationMiddleware;

  private readonly getSubdomain = (req: Request): string => {
    const subdomain = new URL(req.headers.origin + req.baseUrl).hostname.split(
      '.'
    )[0];

    if (
      !compareStrings(subdomain, 'admin') ||
      !compareStrings(subdomain, 'www') ||
      !compareStrings(subdomain, 'recruiter')
    ) {
      throw new Error('Invalid subdomain.');
    }

    return subdomain;
  };

  /**
   * Creates an instance of AuthorizationMiddleware.
   * @memberof AuthorizationMiddleware
   */
  constructor() {
    super('auth');
    this.moduleName = 'authorization.middleware';
    this.jwtUtil = new JwtUtil();
    this.authenticationMiddleware = new AuthenticationMiddleware();
  }

  /**
   * Middleware to check authorization for general access.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public isAuthorized = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    this.authenticationMiddleware.isAuthenticated(req, res, () => {
      const { role, token } = req.app.locals.authorizationConfig;

      try {
        this.jwtUtil.verifyJwtToken(
          { role, tokenType: 'accessToken', jwtToken: token },
          (error, decodedToken) => {
            if (error) {
              return this.error(
                res,
                403,
                'Invalid or expired authorization token.'
              );
            }
            req.app.locals.user = decodedToken;
            next();
          }
        );
      } catch (error) {
        console.error('Error during authorization:', error);
        this.error(res, 403, 'Access denied.');
      }
    });
  };

  /**
   * Middleware to authorize account activation.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public authorizeAccountActivation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const subdomain = this.getSubdomain(req);
    const role = this.authenticationMiddleware.getUserRole(subdomain);
    const token = req.query.token as string;

    if (!token) {
      const errorMessage = encodeURIComponent('Activation token is missing.');
      return res.redirect(
        301,
        `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/activate?errorMessage=${errorMessage}`
      );
    }

    try {
      this.jwtUtil.verifyJwtToken(
        { role, tokenType: 'activationToken', jwtToken: token },
        (error, decoded) => {
          if (error) {
            const errorMessage = encodeURIComponent(
              'Invalid or expired activation token.'
            );
            return res.redirect(
              301,
              `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/activate?errorMessage=${errorMessage}`
            );
          }
          req.app.locals.user = decoded;
          next();
        }
      );
    } catch (error) {
      console.error('Error during account activation:', error);
      const errorMessage = encodeURIComponent(
        'Unable to process your request.'
      );
      res.redirect(
        301,
        `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/activate?errorMessage=${errorMessage}`
      );
    }
  };

  /**
   * Middleware to authorize password reset.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>}
   */
  public authorizePasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const subdomain = this.getSubdomain(req);
    const role = this.authenticationMiddleware.getUserRole(subdomain);
    const token = req.query.token as string;

    if (!token) {
      const errorMessage = encodeURIComponent('Password token is missing.');
      return res.redirect(
        301,
        `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/reset-password?errorMessage=${errorMessage}`
      );
    }
    try {
      this.jwtUtil.verifyJwtToken(
        { role, tokenType: 'passwordToken', jwtToken: token },
        (error, decoded) => {
          if (error) {
            console.error('failed to verify reset pasword token', error);
            const errorMessage = encodeURIComponent(
              'Invalid or expired password token.'
            );
            return res.redirect(
              301,
              `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/reset-password?errorMessage=${errorMessage}`
            );
          }
          req.app.locals.user = decoded;
          next();
        }
      );
    } catch (error) {
      console.error('Error during password reset:', error);
      const errorMessage = encodeURIComponent(
        'Unable to process your request.'
      );
      res.redirect(
        301,
        `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/reset-password?errorMessage=${errorMessage}`
      );
    }
  };
}
