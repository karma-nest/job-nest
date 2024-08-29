/**
 * @fileoverview Helper class for managing Job-related operations in the database.
 * @module JobHelper
 * @version 1.0.0
 */

import { Op, WhereOptions, Transaction } from 'sequelize';
import { sequelize } from '../libs';
import { IJob, IJobQuery } from '../interfaces';
import { IJobDTO, toIJobDTO } from '../dtos';
import { models } from '../models/associations';

export default class JobHelper {
  private readonly jobModel: typeof models.Job;
  private transaction: Transaction | null;

  /**
   * Starts a new transaction if one is not already active.
   * @returns {Promise<void>}
   * @private
   */
  private async startTransaction(): Promise<void> {
    if (!this.transaction) {
      this.transaction = await sequelize.transaction();
    }
  }

  /**
   * Commits the current transaction.
   * @returns {Promise<void>}
   * @private
   */
  private async commitTransaction(): Promise<void> {
    if (this.transaction) {
      await this.transaction.commit();
      this.transaction = null;
    }
  }

  /**
   * Rolls back the current transaction.
   * @returns {Promise<void>}
   * @private
   */
  private async rollbackTransaction(): Promise<void> {
    if (this.transaction) {
      await this.transaction.rollback();
      this.transaction = null;
    }
  }

  /**
   * Builds a Sequelize where clause based on the provided job query.
   * @param {IJobQuery} jobQuery - The query parameters for filtering jobs.
   * @returns {WhereOptions} The where clause to be used in a Sequelize query.
   */
  private buildWhereClause = (jobQuery: IJobQuery): WhereOptions => {
    const whereClause: WhereOptions = {};

    if (jobQuery.isActive !== undefined) {
      whereClause['isActive'] = { [Op.eq]: jobQuery.isActive };
    }

    if (jobQuery.title) {
      whereClause['title'] = { [Op.iLike]: `%${jobQuery.title}%` };
    }

    if (jobQuery.type) {
      whereClause.raw = sequelize.where(
        sequelize.cast(sequelize.col('type'), 'TEXT'),
        {
          [Op.iLike]: `%${jobQuery.type}%`,
        }
      );
    }

    if (jobQuery.location) {
      whereClause['location'] = { [Op.iLike]: `%${jobQuery.location}%` };
    }

    return whereClause;
  };

  /**
   * Constructs the JobHelper instance and initializes the jobModel and transaction properties.
   */
  constructor() {
    this.jobModel = models.Job;
    this.transaction = null;
  }

  /**
   * Creates a new job record in the database.
   * @param {Partial<IJob>} jobData - The job data to be inserted.
   * @returns {Promise<void>}
   * @throws Will throw an error if the job creation fails.
   */
  public createJob = async (jobData: Partial<IJob>): Promise<void> => {
    try {
      await this.startTransaction();
      await this.jobModel.create(jobData, { transaction: this.transaction });
      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  };

  /**
   * Retrieves a job by its ID, increments its view count, and returns its DTO.
   * @param {number} jobId - The ID of the job to retrieve.
   * @returns {Promise<IJobDTO | null>} The job DTO, or null if not found.
   * @throws Will throw an error if the job retrieval fails.
   */
  public getJob = async (jobId: number): Promise<IJobDTO | null> => {
    try {
      await this.startTransaction();
      const jobRecord = await this.jobModel.findOne({
        where: { id: jobId },
        include: [
          {
            model: models.Recruiter,
            as: 'recruiter',
            include: [{ model: models.User, as: 'user' }],
          },
        ],
        transaction: this.transaction,
      });

      if (jobRecord) {
        jobRecord.views += 1;
        await jobRecord.save({ transaction: this.transaction });
        await this.commitTransaction();
        return toIJobDTO(jobRecord);
      }

      await this.rollbackTransaction();
      return null;
    } catch (error) {
      await this.rollbackTransaction();
      console.error('Error retrieving job:', error);
      throw error;
    }
  };

  /**
   * Retrieves a list of jobs based on the provided query parameters.
   * @param {IJobQuery} jobsQuery - The query parameters for filtering jobs.
   * @returns {Promise<IJobDTO[] | null>} A list of job DTOs, or null if none found.
   * @throws Will throw an error if the job retrieval fails.
   */
  public getJobs = async (jobsQuery: IJobQuery): Promise<IJobDTO[]> => {
    try {
      const pageSize = jobsQuery.pageSize | 12;
      const page = jobsQuery.page || 1;
      const offset = (page - 1) * pageSize;

      const whereClause = this.buildWhereClause(jobsQuery);
      const jobs = await this.jobModel.findAll({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        include: [
          {
            model: models.Recruiter,
            as: 'recruiter',
            include: [{ model: models.User, as: 'user' }],
          },
        ],
        limit: pageSize,
        offset: offset,
        transaction: this.transaction || undefined,
      });

      if (jobs.length === 0) {
        return [];
      }

      const jobDtos = jobs.map((job) => toIJobDTO(job));
      return jobDtos;
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      throw error;
    }
  };

  /**
   * Updates a job record in the database.
   * @param {number} jobId - The ID of the job to update.
   * @param {Partial<IJob>} jobData - The data to update the job with.
   * @returns {Promise<void>}
   * @throws Will throw an error if the job update fails.
   */
  public updateJob = async (
    jobId: number,
    jobData: Partial<IJob>
  ): Promise<void> => {
    try {
      await this.startTransaction();
      await this.jobModel.update(jobData, {
        where: { id: jobId },
        transaction: this.transaction,
      });
      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      console.error('Error updating job:', error);
      throw error;
    }
  };

  /**
   * Removes a job record from the database.
   * @param {number} jobId - The ID of the job to remove.
   * @returns {Promise<void>}
   * @throws Will throw an error if the job removal fails.
   */
  public removeJob = async (jobId: number): Promise<void> => {
    try {
      await this.startTransaction();
      await this.jobModel.destroy({
        where: { id: jobId },
        transaction: this.transaction,
      });
      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      console.error('Error removing job:', error);
      throw error;
    }
  };
}
