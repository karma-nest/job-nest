/**
 * @fileoverview Middleware for handling authorization logic.
 * @module PrivateAuthorizationMiddleware
 * @version 1.0.0
 */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtUtil, ResponseUtil } from '../utils';
import { authenticationMiddleware } from './';

export default class PrivateAuthorizationMiddleware extends ResponseUtil {
  private readonly jwtUtil: JwtUtil;

  private static readonly ERROR_MESSAGES = {
    AUTH_ERROR: 'Error during authorization:',
    INVALID_TOKEN: 'Invalid or expired authorization token.',
    ACCESS_DENIED: 'Access denied.',
    SESSION_EXPIRED: 'Session has expired. Please log in again.',
  };

  private static instance: PrivateAuthorizationMiddleware;

  private constructor() {
    super('authorization');
    this.moduleName = 'authorization.middleware';
    this.jwtUtil = new JwtUtil();
  }

  public static getInstance(): PrivateAuthorizationMiddleware {
    if (!PrivateAuthorizationMiddleware.instance) {
      PrivateAuthorizationMiddleware.instance =
        new PrivateAuthorizationMiddleware();
    }
    return PrivateAuthorizationMiddleware.instance;
  }

  private authorizeRole(role: string) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        authenticationMiddleware.isAuthenticated(req, res, () => {
          const { token } = req.app.locals.authorizationConfig;

          const jwtPayload = {
            role,
            tokenType: 'accessToken',
            jwtToken: token,
          };

          this.jwtUtil.verifyJwtToken(jwtPayload, (error, decoded) => {
            if (error || decoded['role'] !== role) {
              const errorMessage =
                error.name === 'TokenExpiredError'
                  ? PrivateAuthorizationMiddleware.ERROR_MESSAGES
                      .SESSION_EXPIRED
                  : PrivateAuthorizationMiddleware.ERROR_MESSAGES.INVALID_TOKEN;
              return this.error(res, StatusCodes.UNAUTHORIZED, errorMessage);
            }

            req.app.locals.user = decoded;
            next();
          });
        });
      } catch (error) {
        console.error(
          PrivateAuthorizationMiddleware.ERROR_MESSAGES.AUTH_ERROR,
          error
        );
        this.error(
          res,
          StatusCodes.FORBIDDEN,
          PrivateAuthorizationMiddleware.ERROR_MESSAGES.ACCESS_DENIED
        );
      }
    };
  }

  public authorizeRecruiterOrCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      authenticationMiddleware.isAuthenticated(req, res, () => {
        const { token, role } = req.app.locals.authorizationConfig;

        const jwtPayload = {
          role,
          tokenType: 'accessToken',
          jwtToken: token,
        };

        this.jwtUtil.verifyJwtToken(jwtPayload, (error, decoded) => {
          if (error || !['recruiter', 'candidate'].includes(decoded['role'])) {
            console.error(error);
            const errorMessage =
              error.name === 'TokenExpiredError'
                ? PrivateAuthorizationMiddleware.ERROR_MESSAGES.SESSION_EXPIRED
                : PrivateAuthorizationMiddleware.ERROR_MESSAGES.INVALID_TOKEN;
            return this.error(res, StatusCodes.UNAUTHORIZED, errorMessage);
          }

          req.app.locals.user = decoded;
          next();
        });
      });
    } catch (error) {
      console.error(
        PrivateAuthorizationMiddleware.ERROR_MESSAGES.AUTH_ERROR,
        error
      );
      this.error(
        res,
        StatusCodes.FORBIDDEN,
        PrivateAuthorizationMiddleware.ERROR_MESSAGES.ACCESS_DENIED
      );
    }
  };

  /**
   * Authorize an admin.
   */
  public authorizeAdmin = this.authorizeRole('admin');

  /**
   * Authorize a candidate.
   */
  public authorizeCandidate = this.authorizeRole('candidate');

  /**
   * Authorize a recruiter.
   */
  public authorizeRecruiter = this.authorizeRole('recruiter');
}

export const privateAuthorizationMiddleware =
  PrivateAuthorizationMiddleware.getInstance();
