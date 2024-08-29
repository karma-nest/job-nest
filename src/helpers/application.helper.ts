/* eslint-disable @typescript-eslint/no-explicit-any */
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

  public createApplication = async (
    applicationData: IApplication
  ): Promise<IApplication | null> => {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const application = await this.applicationModel.create(applicationData, {
        transaction,
      });

      await transaction.commit();

      return application ? application : null;
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      console.error('Error creating application:', error);
      throw error;
    }
  };

  public getApplication = async (
    applicationFilter: IApplicationQuery
  ): Promise<IApplicationDTO | null> => {
    try {
      const queryConditions: any = {
        [Op.or]: [],
      };

      if (applicationFilter.applicationId) {
        queryConditions[Op.or].push({ id: applicationFilter.applicationId });
      }
      if (applicationFilter.candidateId) {
        queryConditions[Op.or].push({
          candidateId: applicationFilter.candidateId,
        });
      }

      // Fetch the application with associated models
      const application = await this.applicationModel.findOne({
        where: queryConditions,
        include: [
          {
            model: models.Job,
            as: 'job',
            include: [
              {
                model: models.Recruiter,
                as: 'recruiter',
                include: [
                  {
                    model: models.User,
                    as: 'user',
                  },
                ],
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

  public getApplications = async (
    filterQuery: IApplicationsQuery,
    page = 1,
    pageSize = 12
  ): Promise<IApplicationDTO[]> => {
    try {
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      // Fetch the applications with associated models and pagination
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
                include: [
                  {
                    model: models.User,
                    as: 'user',
                  },
                ],
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
        limit,
        offset,
      });

      return applications.map(toIApplicationDTO);
    } catch (error) {
      console.error('Error retrieving applications:', error);
      throw error;
    }
  };

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
