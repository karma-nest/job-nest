/**
 * @fileoverview
 * @version 1.0.0
 * @module AuthenticationMiddleware
 */
import { Request, Response, NextFunction } from 'express';
import { IAuthorizationConfig } from '../interfaces';
import { ResponseUtil } from '../utils';
import { StatusCodes } from 'http-status-codes';

export default class AuthenticationMiddleware extends ResponseUtil {
  private static instance: AuthenticationMiddleware;

  private constructor() {
    super('auth');
    this.moduleName = 'authentication.middleware';
  }

  public static getInstance(): AuthenticationMiddleware {
    if (!AuthenticationMiddleware.instance) {
      AuthenticationMiddleware.instance = new AuthenticationMiddleware();
    }
    return AuthenticationMiddleware.instance;
  }

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

  public getSubdomain = (req: Request): string => {
    const { origin, baseUrl } = req.headers;
    const hostname = new URL(origin + baseUrl).hostname;
    const subdomain = hostname.split('.')[0];

    if (!['admin', 'www', 'recruiter'].includes(subdomain)) {
      throw new Error('Invalid subdomain.');
    }

    return subdomain;
  };

  public isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authorizationHeader = req.headers['x-authorization'];
    const subdomain = this.getSubdomain(req);

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
      role: role,
      subdomain: subdomain,
    };

    req.app.locals.authorizationConfig = { ...authorizationConfig };

    next();
  };
}

export const authenticationMiddleware = AuthenticationMiddleware.getInstance();
