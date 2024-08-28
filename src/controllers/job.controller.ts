/**
 * @fileoverview Controller to handle job-related HTTP requests.
 * @module JobController
 * @version 1.0.0
 */

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils';
import { IJob, IJobQuery } from '../interfaces';
import JobService from '../services/job.service';
import { jobValidator } from '../validators';

/**
 * Controller for handling job-related operations.
 * Extends the ResponseUtil class for consistent HTTP responses.
 */
export default class JobController extends ResponseUtil {
  private readonly jobService: JobService;

  /**
   * Initializes a new instance of the JobController class.
   */
  constructor() {
    super('job');
    this.jobService = new JobService('job.controller');
  }

  /**
   * Validates and returns the job ID from the request parameters.
   * @param {Request} req - The incoming request object.
   * @returns {number} - The validated job ID.
   * @throws {Error} - If the job ID is invalid.
   * @private
   */
  private validateJobId(req: Request): number {
    const jobId = parseInt(req.params.jobId, 10);
    if (isNaN(jobId)) {
      throw new Error('Invalid job ID');
    }
    return jobId;
  }

  /**
   * Handles the creation of a new job.
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  public createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.app.locals.user.id;
      const jobData = req.body as Partial<IJob>;

      const { error } = jobValidator.create(jobData);
      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.jobService.createJob(userId, jobData);
      return this.response(res, StatusCodes.CREATED, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Handles fetching a job by its ID.
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  public getJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = this.validateJobId(req);
      const payload = await this.jobService.getJob(jobId);
      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Handles filtering jobs based on query parameters.
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  public filterJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const filterQuery = req.query as IJobQuery;
      const payload = await this.jobService.filterJobs(filterQuery);
      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Handles updating an existing job by its ID.
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  public updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = this.validateJobId(req);
      const updateData = req.body as Partial<IJob>;

      const { error } = jobValidator.update(updateData);
      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.jobService.updateJob(jobId, updateData);
      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Handles removing a job by its ID.
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   */
  public removeJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobId = this.validateJobId(req);
      await this.jobService.removeJob(jobId);
      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
