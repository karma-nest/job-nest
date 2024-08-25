/**
 * @fileoverview AuthController to handle authentication related operations.
 * @version 1.0.0
 * @module AuthController
 */

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { ResponseUtil } from '../utils';
import {
  IAdminRegister,
  ICandidateRegister,
  IRecruiterRegister,
} from '../interfaces';
import { registerValidator, compareStrings } from '../validators';
import validator from 'validator';

export default class AuthController extends ResponseUtil {
  private readonly authService: AuthService;

  constructor() {
    super('auth');
    this.moduleName = 'auth.controller';
    this.authService = new AuthService();
  }

  /**
   * Register a new user based on role.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      // Assert the type of req.query and provide a default value if role is missing
      const { role }: { role?: 'admin' | 'candidate' | 'recruiter' } =
        req.query || {};
      const userData = req.body as
        | IAdminRegister
        | ICandidateRegister
        | IRecruiterRegister;
      if (!role || !['admin', 'candidate', 'recruiter'].includes(role)) {
        return this.unprocessableEntity(res, 'All fields are required.');
      }

      switch (role) {
        case 'admin':
          registerValidator(role, userData);
          break;
        case 'candidate':
          registerValidator(role, userData);
          break;
        case 'recruiter':
          registerValidator(role, userData);
          break;
        default:
          return this.unprocessableEntity(res, undefined);
      }

      const payload = await this.authService.register(role, userData);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Login a user.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return this.unprocessableEntity(
        res,
        'Username and password are required.'
      );
    }

    try {
      const payload = await this.authService.login(email, password);
      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Logout a user.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public logout = async (req: Request, res: Response): Promise<void> => {
    const { id }: { id: number } = req.app.locals.user;

    if (!id) {
      return this.unprocessableEntity(res, undefined);
    }
    try {
      const payload = await this.authService.logout(id);
      return this.response(res, StatusCodes.NO_CONTENT, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Handle forgot password request.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email }: { email: string } = req.body;

    if (!email) {
      return this.unprocessableEntity(res, 'Username is required.');
    }

    try {
      const payload = await this.authService.forgotPassword(email);
      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Reset password for a user.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { id }: { id: number } = req.app.locals.user;
    const {
      newPassword,
      confirmPassword,
    }: { newPassword: string; confirmPassword: string } = req.body;

    if (!id || !newPassword || !confirmPassword) {
      return this.unprocessableEntity(res, undefined);
    }

    if (!compareStrings(newPassword, confirmPassword)) {
      return this.unprocessableEntity(
        res,
        'New password and confirm password do not match.'
      );
    }

    try {
      const payload = await this.authService.resetPassword(id, newPassword);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Request account activation.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public requestAccountActivation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email }: { email: string } = req.body;

    if (!email) {
      return this.unprocessableEntity(res, 'Username is required.');
    }

    if (!validator.isEmail(email)) {
      return this.unprocessableEntity(res, 'Invalid username.');
    }

    try {
      const payload = await this.authService.requestActivation(email);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Confirm account activation.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public confirmAccountActivation = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id }: { id: number } = req.app.locals.user;

    if (!id) {
      return this.unprocessableEntity(res, undefined);
    }

    try {
      const payload = await this.authService.confirmActivation(id);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
