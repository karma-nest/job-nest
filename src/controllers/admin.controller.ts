/**
 * @fileoverview Controller for handling admin-related HTTP requests.
 * @version 1.0.0
 * @module AdminController
 */

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { AdminService, UserService } from '../services';
import { ResponseUtil } from '../utils';
import { IAdmin } from '../interfaces';
import { validateAdmin } from '../validators';

/**
 * Controller class for managing admin profiles.
 * @class AdminController
 * @extends ResponseUtil
 */
export default class AdminController extends ResponseUtil {
  private readonly adminService: AdminService;
  private readonly userService: UserService;

  /**
   * Creates an instance of AdminController.
   */
  constructor() {
    super('admin');

    const moduleName = `${this.moduleName}.controller`;

    this.adminService = new AdminService(moduleName);
    this.userService = new UserService(moduleName);
  }

  /**
   * Retrieves the profile of the currently authenticated admin.
   *
   * @param {Request} req - The HTTP request object, expected to contain the admin's ID in `req.app.locals.user`.
   * @param {Response} res - The HTTP response object used to send the response back to the client.
   * @returns {Promise<void>} - A promise that resolves when the admin profile is retrieved and the response is sent.
   */
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.app.locals.user;
      const payload = await this.adminService.getAdmin(id);
      return this.response(res, StatusCodes.CREATED, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Updates the profile of the currently authenticated admin.
   *
   * @param {Request} req - The HTTP request object, expected to contain the admin's ID in `req.app.locals.user`.
   * @param {Response} res - The HTTP response object used to send the response back to the client.
   * @returns {Promise<void>} - A promise that resolves when the admin profile update is processed and the response is sent.
   */
  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.app.locals.user;
      const updateData = req.body as Partial<IAdmin>;
      const { error } = validateAdmin(updateData);

      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.adminService.updateAdmin(id, updateData);
      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Deletes the account of the currently authenticated user.
   *
   * @param {Request} req - The HTTP request object, expected to contain the user's ID in `req.app.locals.user`.
   * @param {Response} res - The HTTP response object used to send the response back to the client.
   * @returns {Promise<void>} - A promise that resolves when the account deletion process is complete.
   */
  public deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.app.locals.user;

      await this.userService.removeAccount(id);
      return this.response(res, StatusCodes.OK, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
