/**
 * @fileoverview Defines the routes for Job-related API endpoints.
 * @module JobRoutes
 * @version 1.0.0
 */
import { Router } from 'express';
import JobController from '../controllers/job.controller';
import { privateAuthorizationMiddleware } from '../middlewares';

export default class JobRoutes {
  private readonly router: Router;

  constructor(
    private readonly jobController: JobController = new JobController()
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  /**
   * Sets up the routes for the job-related endpoints.
   * @private
   */
  private setupRoutes(): void {
    this.router.post(
      '/',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.jobController.createJob
    );
    this.router.get('/:jobId', this.jobController.getJob);
    this.router.get('/', this.jobController.filterJobs);
    this.router.patch(
      '/:jobId',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.jobController.updateJob
    );
    this.router.delete(
      '/:jobId',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.jobController.removeJob
    );
  }

  /**
   * Initializes the job router and returns the configured Router instance.
   * @returns {Router} The initialized Router instance.
   */
  public init(): Router {
    return this.router;
  }
}
