/**
 * @fileoverview Defines routes for managing recruiter-related HTTP requests.
 * @module recruiterRoutes
 * @version 1.0.0
 */
import { Router } from 'express';
import { privateAuthorizationMiddleware } from '../middlewares';
import { RecruiterController, UserController } from '../controllers';

/**
 * Class representing the routes for recruiter management.
 */
export default class RecruiterRoutes {
  private readonly recruiterRouter: Router;

  /**
   * Creates an instance of RecruiterRoutes.
   * @param {RecruiterController} [recruiterController] - The controller handling recruiter-related requests.
   * @param {UserController} [userController] - The controller handling user-related requests.
   */
  constructor(
    private readonly recruiterController: RecruiterController = new RecruiterController(),
    private readonly userController: UserController = new UserController(
      'recruiter'
    )
  ) {
    this.recruiterRouter = Router();
  }

  /**
   * Sets up the routes for recruiter management.
   * @private
   */
  private setupRoutes(): void {
    this.recruiterRouter.get(
      '/',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.recruiterController.getRecruiter
    );
    this.recruiterRouter.get('', this.recruiterController.getRecruiters);
    this.recruiterRouter.patch(
      '/',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.recruiterController.updateProfile
    );
    this.recruiterRouter.patch(
      '/contact',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.userController.updateContactDetails
    );
    this.recruiterRouter.patch(
      '/password',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.userController.updatePassword
    );
    this.recruiterRouter.delete(
      '/',
      privateAuthorizationMiddleware.authorizeRecruiter,
      this.userController.removeAccount
    );
  }

  /**
   * Initializes the recruiter routes.
   * @returns {Router} - The configured recruiter router.
   */
  public init(): Router {
    this.setupRoutes();
    return this.recruiterRouter;
  }
}
