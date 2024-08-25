/**
 * @fileoverview
 * @version
 * @module authenticationMiddleware
 */
import { Request, Response, NextFunction } from 'express';
import { IAuthorizationConfig } from '../interfaces';
import { ResponseUtil } from '../utils';
import { StatusCodes } from 'http-status-codes';

export default class AuthenticationMiddleware extends ResponseUtil {
  /**
   * Constructor for the AuthenticationMiddleware class.
   */
  constructor() {
    super('auth');
    this.moduleName = 'authentication.middleware';
  }

  /**
   * Retrieves the user role based on subdomain.
   * @param {string} subdomain - The subdomain extracted from the URL.
   * @returns {string} The user role associated with the subdomain.
   * @public
   */
  public getUserRole = (subdomain: string): string => {
    switch (subdomain) {
      case 'admin':
        return 'admin';
      case 'www':
        return 'candidate';
      case 'recruiter':
        return 'recruiter';
      default:
        throw new Error('Invalid subdomain');
    }
  };

  /**
   * Middleware function that checks for a valid API key in the X-Authorization header.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next function.
   * @returns {void}
   */
  public isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authorizationHeader = req.headers['x-authorization'];
    const subdomain = new URL(req.headers.origin + req.baseUrl).hostname.split(
      '.'
    )[0];

    if (!authorizationHeader) {
      return this.error(
        res,
        StatusCodes.UNAUTHORIZED,
        "You did not provide an API key. You need to provide your API key in the X-Authorization header (e.g 'X-Authorization: Bearer YOUR_API_KEY')"
      );
    }

    const bearerToken = `${authorizationHeader}`.split(' ')[1];

    if (!bearerToken) {
      return this.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Invalid authorization header format.'
      );
    }

    const role = this.getUserRole(subdomain);

    const authorizationConfig: IAuthorizationConfig = {
      token: bearerToken,
      role,
    };

    req.app.locals.authorizationConfig = { ...authorizationConfig };

    next();
  };
}
