/**
 * @fileoverview Middleware for handling password reset authorization.
 * @version 1.0.0
 * @module PasswordAuthorizationMiddleware
 */
import { NextFunction, Request, Response } from 'express';
import { JwtUtil, ResponseUtil } from '../utils';
import { notificationConfig } from '../configs';
import { authenticationMiddleware } from './';

/**
 * Middleware class for handling password reset authorization.
 * @class PasswordAuthorizationMiddleware
 * @extends ResponseUtil
 */
export default class PasswordAuthorizationMiddleware extends ResponseUtil {
  private static instance: PasswordAuthorizationMiddleware;
  private readonly jwtUtil: JwtUtil;

  /**
   * Constructs an instance of PasswordAuthorizationMiddleware.
   * @memberof PasswordAuthorizationMiddleware
   */
  private constructor() {
    super('auth');
    this.moduleName = 'authorization.middleware';
    this.jwtUtil = new JwtUtil();
  }

  /**
   * Gets the singleton instance of PasswordAuthorizationMiddleware.
   * @static
   * @returns {PasswordAuthorizationMiddleware} The singleton instance.
   */
  public static getInstance(): PasswordAuthorizationMiddleware {
    if (!PasswordAuthorizationMiddleware.instance) {
      PasswordAuthorizationMiddleware.instance =
        new PasswordAuthorizationMiddleware();
    }
    return PasswordAuthorizationMiddleware.instance;
  }

  /**
   * Middleware to authorize password reset requests.
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
    const subdomain = authenticationMiddleware.getSubdomain(req);
    const role = authenticationMiddleware.getUserRole(subdomain);
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
            const errorMessage = encodeURIComponent(
              'Invalid or expired password token.'
            );
            console.error('Failed to verify password reset token', error);
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

export const passwordAuthorizationMiddleware =
  PasswordAuthorizationMiddleware.getInstance();
