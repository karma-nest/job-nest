/**
 * @fileoverview Defines routes for managing candidate-related HTTP requests.
 * @module CandidateRoutes
 * @version 1.0.0
 */

import { Router } from 'express';
import CandidateController from '../controllers/candidate.controller';
import UserController from '../controllers/user.controller';

/**
 * Class representing the routes for candidate management.
 */
export default class CandidateRoutes {
  private readonly candidateRouter: Router;

  /**
   * Creates an instance of CandidateRoutes.
   * @param {CandidateController} [candidateController] - Instance of CandidateController.
   * @param {UserController} [userController] - Instance of UserController.
   */
  constructor(
    private readonly candidateController: CandidateController = new CandidateController(),
    private readonly userController: UserController = new UserController(
      'candidate'
    )
  ) {
    this.candidateRouter = Router();
  }

  /**
   * Sets up the routes for candidate management.
   * @private
   */
  private setupRoutes(): void {
    this.candidateRouter.get('/', this.candidateController.getProfile);
    this.candidateRouter.patch('/', this.candidateController.updateProfile);
    this.candidateRouter.patch(
      '/contact',
      this.userController.updateContactDetails
    );
    this.candidateRouter.patch('/password', this.userController.updatePassword);
    this.candidateRouter.delete('/', this.userController.removeAccount);
  }

  /**
   * Initializes the routes and returns the router instance.
   * @returns {Router} The configured router instance.
   */
  public init = (): Router => {
    this.setupRoutes();
    return this.candidateRouter;
  };
}
