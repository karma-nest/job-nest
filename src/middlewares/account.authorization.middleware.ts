/**
 * @fileoverview Authorization Middleware for handling account activation.
 * @version 1.0.0
 * @module AccountAuthorizationMiddleware
 */
import { NextFunction, Request, Response } from 'express';
import { JwtUtil, ResponseUtil } from '../utils';
import { notificationConfig } from '../configs';
import { authenticationMiddleware } from './';

/**
 * Middleware class for handling account authorization.
 * @class AccountAuthorizationMiddleware
 * @extends ResponseUtil
 */
export default class AccountAuthorizationMiddleware extends ResponseUtil {
  private static instance: AccountAuthorizationMiddleware;
  private readonly jwtUtil: JwtUtil;

  /**
   * Constructs an instance of AccountAuthorizationMiddleware.
   * @memberof AccountAuthorizationMiddleware
   */
  private constructor() {
    super('auth');
    this.moduleName = 'authorization.middleware';
    this.jwtUtil = new JwtUtil();
  }

  /**
   * Gets the singleton instance of AccountAuthorizationMiddleware.
   * @static
   * @returns {AccountAuthorizationMiddleware} The singleton instance.
   */
  public static getInstance(): AccountAuthorizationMiddleware {
    if (!AccountAuthorizationMiddleware.instance) {
      AccountAuthorizationMiddleware.instance =
        new AccountAuthorizationMiddleware();
    }
    return AccountAuthorizationMiddleware.instance;
  }

  /**
   * Extracts and validates the subdomain from the request.
   * @param {Request} req - The request object.
   * @returns {string} The extracted subdomain.
   * @throws {Error} Throws an error if the subdomain is invalid.
   */
  private getSubdomain(req: Request): string {
    const { origin, baseUrl } = req.headers;
    const hostname = new URL(origin + baseUrl).hostname;
    const subdomain = hostname.split('.')[0];

    if (!['www', 'recruiter'].includes(subdomain)) {
      throw new Error('Invalid subdomain.');
    }

    return subdomain;
  }

  /**
   * Middleware to authorize account activation requests.
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
    const subdomain = authenticationMiddleware.getSubdomain(req);
    const role = authenticationMiddleware.getUserRole(subdomain);
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
      const errorMessage = encodeURIComponent(
        'Unable to process your request.'
      );
      res.redirect(
        301,
        `https://${subdomain}.${notificationConfig?.mailgen?.product?.link}/pages/auth/activate?errorMessage=${errorMessage}`
      );
    }
  };
}

export const accountAuthorizationMiddleware =
  AccountAuthorizationMiddleware.getInstance();
