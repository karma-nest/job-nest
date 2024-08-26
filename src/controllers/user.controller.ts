/**
 * @fileoverview Controller responsible for user account management, including updating contact details, passwords, and account removal.
 * @module UserController
 * @version 1.0.0
 */
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils';
import { UserService } from '../services';
import { IUpdateContactQuery, IUpdatePasswordQuery } from '../interfaces';
import { validateContactUpdate, validatePasswordUpdate } from '../validators';

export default class UserController extends ResponseUtil {
  private readonly userService: UserService;

  /**
   * Creates an instance of UserController.
   * @param {string} moduleName - The name of the module.
   */
  constructor(moduleName: string) {
    super(moduleName);
    this.userService = new UserService(moduleName);
  }

  /**
   * Updates the contact details of a user.
   * @param {Request} req - Express request object containing user details.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public updateContactDetails = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.app.locals.user.id;
      const contactDetails: IUpdateContactQuery = req.body;

      const { error } = validateContactUpdate(contactDetails);
      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.userService.updateContactDetails(userId, contactDetails);
      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Updates the password of a user.
   * @param {Request} req - Express request object containing user details.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public updatePassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.app.locals.user.id;
      const passwordQuery: IUpdatePasswordQuery = req.body;

      const { error } = validatePasswordUpdate(passwordQuery);
      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.userService.updatePassword(userId, passwordQuery);
      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Removes the account of a user.
   * @param {Request} req - Express request object containing user details.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>}
   */
  public removeAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.app.locals.user.id;

      await this.userService.removeAccount(userId);
      return this.response(res, StatusCodes.OK, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
