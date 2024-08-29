/**
 * @fileoverview ApplicationService handles the business logic related to job applications.
 * @module ApplicationService
 * @version 1.0
 */

import { IApplicationDTO } from '../dtos/application.dto';
import { ApplicationHelper, CandidateHelper, JobHelper } from '../helpers';
import { IApplicationsQuery } from '../interfaces';
import {
  BadRequestError,
  CreateErrorUtil,
  logger,
  NotFoundError,
  NotificationUtil,
} from '../utils';
import { ApplicationStatus } from '../types';
import { ApplicationTemplate } from '../templates';

/**
 * Service class to manage application-related operations.
 */
export default class ApplicationService {
  private readonly moduleName: string;
  private readonly applicationHelper: ApplicationHelper;
  private readonly candidateHelper: CandidateHelper;
  private readonly jobHelper: JobHelper;
  private readonly errorUtil: CreateErrorUtil;
  private readonly notificationUtil: NotificationUtil;
  private readonly applicationTemplate: ApplicationTemplate;

  /**
   * Handles service errors by creating and throwing the appropriate error.
   * @param {string} method - The method where the error occurred.
   * @param {Error} error - The error object.
   * @param {string} errorMessage - The message for the internal server error.
   * @throws {Error} - Throws the original error or an internal server error.
   */
  private handleServiceError(
    method: string,
    error: Error,
    errorMessage: string
  ) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }

    this.errorUtil.createInternalServerError(errorMessage, {
      module: this.moduleName,
      method,
      trace: { error: error.message || error },
    });
    throw error;
  }

  private getEmailContent = (
    status: ApplicationStatus,
    firstName: string,
    application: IApplicationDTO
  ): { subject: string; template: string } => {
    switch (status) {
      case 'Received':
        return {
          subject: 'Your Application Has Been Received!',
          template: this.applicationTemplate.applicationReceived(
            firstName,
            application
          ),
        };
      case 'Shortlisted':
        return {
          subject: 'Your Application Has Been Shortlisted!',
          template: this.applicationTemplate.applicationUnderReview(
            firstName,
            application
          ),
        };
      case 'Approved':
        return {
          subject: 'Congratulations! Your Application Has Been Approved',
          template: this.applicationTemplate.applicationApproved(
            firstName,
            application
          ),
        };
      default:
        return {
          subject: 'Your Application is Now Closed',
          template: this.applicationTemplate.applicationRejected(
            firstName,
            application
          ),
        };
    }
  };

  /**
   * Constructor for ApplicationService.
   * @param {string} moduleName - The name of the module for error logging.
   */
  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.applicationHelper = new ApplicationHelper();
    this.candidateHelper = new CandidateHelper();
    this.jobHelper = new JobHelper();
    this.errorUtil = new CreateErrorUtil();
    this.notificationUtil = new NotificationUtil();
    this.applicationTemplate = new ApplicationTemplate();
  }

  /**
   * Creates a new application for a candidate.
   * @param {number} userId - The ID of the user applying.
   * @param {number} jobId - The ID of the job being applied for.
   * @returns {Promise<void>} - A promise that resolves when the application is created.
   * @throws {BadRequestError} - If the application has already been submitted.
   * @throws {Error} - If an unexpected error occurs.
   */
  public createApplication = async (
    userId: number,
    jobId: number
  ): Promise<void> => {
    try {
      const candidate = await this.candidateHelper.getCandidate(userId);
      const job = await this.jobHelper.getJob(jobId);
      const existingApplication = await this.applicationHelper.getApplication({
        candidateId: candidate.id,
        jobId,
      });

      if (existingApplication) {
        throw this.errorUtil.createBadRequestError(
          'Sorry, application already submitted.',
          {
            module: this.moduleName,
            method: 'createApplication',
            trace: { userId, jobId, error: 'Already applied to job post' },
          }
        );
      }

      const candidatePayload = {
        candidateId: candidate['id'],
        jobId: job['id'],
      };

      const newApplication = await this.applicationHelper.createApplication(
        candidatePayload
      );
      const foundApplication = await this.applicationHelper.getApplication({
        applicationId: newApplication.id,
      });

      const { subject, template } = this.getEmailContent(
        'Received',
        candidate.firstName,
        foundApplication
      );
      await new Promise<void>((resolve) => {
        this.notificationUtil.sendEmail(
          candidate['user']['email'],
          subject,
          template,
          (error) => {
            if (error) {
              logger.application.warn(
                'Failed to send application received email',
                error
              );
              resolve();
            } else {
              resolve();
            }
          }
        );
      });
    } catch (error) {
      this.handleServiceError(
        'createApplication',
        error,
        'Sorry, an unexpected error occurred while creating application.'
      );
    }
  };

  /**
   * Retrieves an application by its ID.
   * @param {number} applicationId - The ID of the application to retrieve.
   * @returns {Promise<IApplicationDTO>} - A promise that resolves to the application DTO.
   * @throws {NotFoundError} - If the application is not found.
   * @throws {Error} - If an unexpected error occurs.
   */
  public getApplication = async (
    applicationId: number
  ): Promise<IApplicationDTO> => {
    try {
      const application = await this.applicationHelper.getApplication({
        applicationId,
      });

      if (!application) {
        throw this.errorUtil.createNotFoundError(
          'Sorry, application not found.',
          {
            module: this.moduleName,
            method: 'getApplication',
            trace: { applicationId, error: 'Application not found' },
          }
        );
      }

      return application;
    } catch (error) {
      this.handleServiceError(
        'getApplication',
        error,
        'Sorry, an unexpected error occurred while fetching application.'
      );
    }
  };

  /**
   * Retrieves a list of applications based on the provided filter query.
   * @param {IApplicationsQuery} filterQuery - The query parameters to filter applications.
   * @returns {Promise<IApplicationDTO[]>} - A promise that resolves to an array of application DTOs.
   * @throws {NotFoundError} - If no applications are found.
   * @throws {Error} - If an unexpected error occurs.
   */
  public getApplications = async (
    filterQuery: IApplicationsQuery
  ): Promise<IApplicationDTO[]> => {
    try {
      const applications = await this.applicationHelper.getApplications(
        filterQuery
      );

      if (applications.length === 0) {
        throw this.errorUtil.createNotFoundError(
          'Sorry, no applications found.',
          {
            module: this.moduleName,
            method: 'getApplications',
            trace: { filterQuery, error: 'No applications found' },
          }
        );
      }

      return applications;
    } catch (error) {
      this.handleServiceError(
        'getApplications',
        error,
        'Sorry, an unexpected error occurred while fetching applications.'
      );
    }
  };

  /**
   * Updates the status of an application.
   * @param {number} applicationId - The ID of the application to update.
   * @param {ApplicationStatus} status - The new status to set for the application.
   * @returns {Promise<void>} - A promise that resolves when the application is updated.
   * @throws {NotFoundError} - If the application is not found.
   * @throws {Error} - If an unexpected error occurs.
   */
  public updateApplication = async (
    applicationId: number,
    status: ApplicationStatus
  ): Promise<void> => {
    try {
      const application = await this.applicationHelper.getApplication({
        applicationId,
      });

      if (!application) {
        throw this.errorUtil.createNotFoundError(
          'Sorry, failed to update application.',
          {
            module: this.moduleName,
            method: 'updateApplication',
            trace: { applicationId, error: 'Application not found' },
          }
        );
      }

      await this.applicationHelper.updateApplication(application.id, status);

      const { candidate } = application;
      const { subject, template } = this.getEmailContent(
        status,
        candidate.firstName,
        application
      );

      await new Promise<void>((resolve) => {
        this.notificationUtil.sendEmail(
          candidate['user']['email'],
          subject,
          template,
          (error) => {
            if (error) {
              logger['application']['warn'](
                'Failed to send application status update email',
                error
              );
              resolve();
            } else {
              resolve();
            }
          }
        );
      });
    } catch (error) {
      this.handleServiceError(
        'updateApplication',
        error,
        'Sorry, failed to update application.'
      );
    }
  };

  /**
   * Removes an application by its ID.
   * @param {number} applicationId - The ID of the application to remove.
   * @returns {Promise<void>} - A promise that resolves when the application is removed.
   * @throws {NotFoundError} - If the application is not found.
   * @throws {Error} - If an unexpected error occurs.
   */
  public removeApplication = async (applicationId: number): Promise<void> => {
    try {
      const application = await this.applicationHelper.getApplication({
        applicationId,
      });

      if (!application) {
        throw this.errorUtil.createNotFoundError(
          'Sorry, failed to remove application.',
          {
            module: this.moduleName,
            method: 'removeApplication',
            trace: { applicationId, error: 'Application not found' },
          }
        );
      }

      await this.applicationHelper.removeApplication(application.id);
    } catch (error) {
      this.handleServiceError(
        'removeApplication',
        error,
        'Sorry, failed to remove application.'
      );
    }
  };
}
