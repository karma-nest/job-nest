/**
 * @fileoverview Defines the routes for application-related API endpoints.
 * @module applicationRoutes
 * @version 1.0.0
 */
import { Router } from 'express';
import { ApplicationController } from '../controllers';
import { privateAuthorizationMiddleware } from '../middlewares';

export default class ApplicationRoutes {
  private readonly router: Router;

  constructor(
    private readonly applicationController: ApplicationController = new ApplicationController()
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  /**
   * Sets up the routes for the application-related endpoints.
   * @private
   */
  private setupRoutes(): void {
    this.router.post(
      '/:jobId',
      privateAuthorizationMiddleware.authorizeCandidate,
      this.applicationController.createApplication
    );
    this.router.get(
      '/:applicationId',
      privateAuthorizationMiddleware.authorizeRecruiterOrCandidate,
      this.applicationController.getApplication
    );
    this.router.get(
      '',
      privateAuthorizationMiddleware.authorizeRecruiterOrCandidate,
      this.applicationController.filterApplications
    );
    this.router.patch(
      '/:applicationId',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.applicationController.updateApplication
    );
    this.router.delete(
      '/:applicationId',
      privateAuthorizationMiddleware.authorizeRecruiterOrCandidate,
      this.applicationController.removeApplication
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
