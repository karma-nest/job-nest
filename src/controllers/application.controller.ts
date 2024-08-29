/**
 * @fileoverview ApplicationController handles the incoming HTTP requests for managing job applications.
 * @module ApplicationController
 * @version 1.0
 */

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseUtil } from '../utils';
import { ApplicationService } from '../services';
import { IApplicationsQuery } from '../interfaces';
import { ApplicationStatus } from '../types';
import { validateUpdateApplication } from '../validators';

/**
 * Controller class to manage application-related HTTP requests.
 */
export default class ApplicationController extends ResponseUtil {
  private readonly applicationService: ApplicationService;

  /**
   * Validates and parses the application ID from the request parameters.
   * @param {Request} req - The express request object.
   * @returns {number} - The validated application ID.
   * @throws {Error} - Throws an error if the application ID is invalid.
   */
  private validateApplicationId = (req: Request): number => {
    const applicationId = parseInt(req.params.applicationId, 10);
    if (isNaN(applicationId)) {
      throw new Error('Invalid application ID');
    }
    return applicationId;
  };

  /**
   * Constructor for ApplicationController.
   * @constructor
   */
  constructor() {
    super('application');
    this.applicationService = new ApplicationService(
      `${this.moduleName}.controller`
    );
  }

  /**
   * Handles the creation of a new application.
   * @async
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @returns {Promise<void>} - A promise resolving to void.
   */
  public createApplication = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const jobId = parseInt(req.params.jobId, 10);
      const userId = req.app.locals.user.id;

      if (isNaN(jobId)) {
        return this.unprocessableEntity(res, 'Invalid job ID.');
      }

      await this.applicationService.createApplication(userId, jobId);

      return this.response(res, StatusCodes.CREATED, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Retrieves a specific application by its ID.
   * @async
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @returns {Promise<void>} - A promise resolving to void.
   */
  public getApplication = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const applicationId = this.validateApplicationId(req);

      const payload = await this.applicationService.getApplication(
        applicationId
      );

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Retrieves a list of applications based on the provided query parameters.
   * @async
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @returns {Promise<void>} - A promise resolving to void.
   */
  public filterApplications = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filterQuery = req.query as IApplicationsQuery;

      const payload = await this.applicationService.getApplications(
        filterQuery
      );

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Updates a specific application by its ID.
   * @async
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @returns {Promise<void>} - A promise resolving to void.
   */
  public updateApplication = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const applicationId = this.validateApplicationId(req);
      const status = req.body.status as ApplicationStatus;

      const { error } = validateUpdateApplication(status);
      if (error) {
        const errorMessage = error.details[0].message
          .replace(/\\"/g, '"')
          .replace(/^"|"$/g, '');
        return this.unprocessableEntity(res, errorMessage);
      }

      await this.applicationService.updateApplication(applicationId, status);

      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Removes a specific application by its ID.
   * @async
   * @param {Request} req - The express request object.
   * @param {Response} res - The express response object.
   * @returns {Promise<void>} - A promise resolving to void.
   */
  public removeApplication = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const applicationId = this.validateApplicationId(req);

      await this.applicationService.removeApplication(applicationId);

      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
