/**
 * @fileoverview This module contains helper methods for managing job applications.
 * @module ApplicationHelper
 * @version 1.0
 */

import { Op, WhereOptions, Transaction } from 'sequelize';
import { sequelize } from '../libs';
import { models } from '../models/associations';
import {
  IApplication,
  IApplicationQuery,
  IApplicationsQuery,
} from '../interfaces';
import { IApplicationDTO, toIApplicationDTO } from '../dtos/application.dto';
import { ApplicationStatus } from '../types';

/**
 * Helper class for managing job application operations.
 */
export default class ApplicationHelper {
  private readonly applicationModel: typeof models.Application;

  /**
   * Creates an instance of ApplicationHelper.
   */
  constructor() {
    this.applicationModel = models.Application;
  }

  /**
   * Builds a Sequelize `where` clause based on the provided filters.
   * @param {IApplicationsQuery} applicationFilters - The filters for querying applications.
   * @returns {WhereOptions} The Sequelize `where` clause.
   */
  private buildWhereClause = (
    applicationFilters: IApplicationsQuery
  ): WhereOptions => {
    const whereClause: WhereOptions = {};

    if (applicationFilters.jobId) {
      whereClause['jobId'] = {
        [Op.eq]: applicationFilters.jobId,
      };
    }

    if (applicationFilters.candidateId) {
      whereClause['candidateId'] = {
        [Op.eq]: applicationFilters.candidateId,
      };
    }

    if (applicationFilters.status) {
      whereClause.raw = sequelize.where(
        sequelize.cast(sequelize.col('status'), 'TEXT'),
        {
          [Op.iLike]: `%${applicationFilters.status}%`,
        }
      );
    }

    return whereClause;
  };

  /**
   * Creates a new application.
   * @param {IApplication} applicationData - The data for the new application.
   * @returns {Promise<void>} A promise that resolves when the application is created.
   */
  public createApplication = async (
    applicationData: IApplication
  ): Promise<void> => {
    const transaction: Transaction = await sequelize.transaction();

    try {
      await this.applicationModel.create(applicationData, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating application:', error);
      throw error;
    }
  };

  /**
   * Retrieves a single application based on the provided filter.
   * @param {IApplicationQuery} applicationFilter - The filter for querying the application.
   * @returns {Promise<IApplicationDTO | null>} A promise that resolves to the application DTO or null if not found.
   */
  public getApplication = async (
    applicationFilter: IApplicationQuery
  ): Promise<IApplicationDTO | null> => {
    try {
      const application = await this.applicationModel.findOne({
        where: {
          [Op.or]: [
            {
              id: {
                [Op.eq]: applicationFilter.applicationId,
              },
            },
            {
              candidateId: {
                [Op.eq]: applicationFilter.candidateId,
              },
            },
          ],
        },
        include: [
          {
            model: models.Job,
            as: 'job',
            include: [
              {
                model: models.Recruiter,
                as: 'recruiter',
              },
            ],
          },
          {
            model: models.Candidate,
            as: 'candidate',
            include: [
              {
                model: models.User,
                as: 'user',
              },
            ],
          },
        ],
      });

      return application ? toIApplicationDTO(application) : null;
    } catch (error) {
      console.error('Error retrieving application:', error);
      throw error;
    }
  };

  /**
   * Retrieves multiple applications based on the provided filter query.
   * @param {IApplicationsQuery} filterQuery - The filter query for applications.
   * @returns {Promise<IApplicationDTO[]>} A promise that resolves to an array of application DTOs.
   */
  public getApplications = async (
    filterQuery: IApplicationsQuery
  ): Promise<IApplicationDTO[]> => {
    try {
      const applications = await this.applicationModel.findAll({
        where: this.buildWhereClause(filterQuery),
        include: [
          {
            model: models.Job,
            as: 'job',
            include: [
              {
                model: models.Recruiter,
                as: 'recruiter',
              },
            ],
          },
          {
            model: models.Candidate,
            as: 'candidate',
            include: [
              {
                model: models.User,
                as: 'user',
              },
            ],
          },
        ],
      });

      return applications.map(toIApplicationDTO);
    } catch (error) {
      console.error('Error retrieving applications:', error);
      throw error;
    }
  };

  /**
   * Updates the status of an application.
   * @param {number} applicationId - The ID of the application to update.
   * @param {ApplicationStatus} status - The new status for the application.
   * @returns {Promise<void>} A promise that resolves when the application status is updated.
   */
  public updateApplication = async (
    applicationId: number,
    status: ApplicationStatus
  ): Promise<void> => {
    const transaction: Transaction = await sequelize.transaction();

    try {
      await this.applicationModel.update(
        { status },
        {
          where: {
            id: {
              [Op.eq]: applicationId,
            },
          },
          transaction,
        }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating application:', error);
      throw error;
    }
  };

  /**
   * Removes an application by its ID.
   * @param {number} applicationId - The ID of the application to remove.
   * @returns {Promise<void>} A promise that resolves when the application is removed.
   */
  public removeApplication = async (applicationId: number): Promise<void> => {
    const transaction: Transaction = await sequelize.transaction();

    try {
      await this.applicationModel.destroy({
        where: {
          id: {
            [Op.eq]: applicationId,
          },
        },
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error removing application:', error);
      throw error;
    }
  };
}
