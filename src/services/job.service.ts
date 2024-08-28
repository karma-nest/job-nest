/**
 * @fileoverview
 * @module
 * @version
 */
import { JobHelper, RecruiterHelper } from '../helpers';
import { IJob, IJobQuery } from '../interfaces';
import { CreateErrorUtil } from '../utils';
import { IJobDTO } from '../dtos';

export default class JobService {
  private readonly moduleName: string;
  private readonly jobHelper: JobHelper;
  private readonly errorUtil: CreateErrorUtil;
  private readonly recruiterHelper: RecruiterHelper;

  /**
   * Helper method to find a job by ID or throw a NotFoundError.
   * @param {number} jobId - The ID of the job.
   * @param {string} methodName - The name of the method calling this function.
   * @returns {Promise<IJob>}
   * @throws {NotFoundError} If the job is not found.
   * @private
   */
  private async findJobByIdOrThrow(
    jobId: number,
    methodName: string
  ): Promise<IJobDTO> {
    const job = await this.jobHelper.getJob(jobId);
    if (!job) {
      throw this.errorUtil.createNotFoundError('Job not found.', {
        module: this.moduleName,
        method: methodName,
        trace: { jobId },
      });
    }
    return job;
  }

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.jobHelper = new JobHelper();
    this.errorUtil = new CreateErrorUtil();
    this.recruiterHelper = new RecruiterHelper();
  }

  /**
   * Creates a new job associated with a recruiter.
   *
   * @param {number} userId - The ID of the user associated with recruiter creating the job.
   * @param {IJob} jobData - The data for the job being created.
   * @throws {InternalServerError} Throws an internal server error if the job creation fails.
   */
  public async createJob(
    userId: number,
    jobData: Partial<IJob>
  ): Promise<void> {
    try {
      const recruiter = await this.recruiterHelper.getRecruiter({ userId });
      const jobInfo = { recruiterId: recruiter['id'], ...jobData };
      await this.jobHelper.createJob(jobInfo);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while creating job.',
        { module: this.moduleName, method: 'createJob', trace: { error } }
      );
    }
  }

  /**
   * Get a job by ID.
   * @param {number} jobId - The ID of the job to retrieve.
   * @returns {Promise<IJob>}
   * @throws {NotFoundError} If the job is not found.
   */
  public async getJob(jobId: number): Promise<IJobDTO> {
    try {
      const job = await this.findJobByIdOrThrow(jobId, 'getJob');
      return job;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while retrieving job.',
        { module: this.moduleName, method: 'getJob', trace: { jobId, error } }
      );
    }
  }

  /**
   * Filter jobs based on query criteria.
   * @param {IJobQuery} filterQuery - The criteria to filter jobs by.
   * @returns {Promise<IJob[]>}
   * @throws {NotFoundError} If no jobs are found.
   */
  public async filterJobs(filterQuery: IJobQuery): Promise<IJobDTO[]> {
    try {
      const filteredJobs = await this.jobHelper.getJobs(filterQuery);

      if (filteredJobs.length === 0) {
        throw this.errorUtil.createNotFoundError('No jobs available.', {
          module: this.moduleName,
          method: 'filterJobs',
          trace: { filterQuery },
        });
      }
      return filteredJobs;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while filtering jobs.',
        {
          module: this.moduleName,
          method: 'filterJobs',
          trace: { filterQuery, error },
        }
      );
    }
  }

  /**
   * Update a job by ID.
   * @param {number} jobId - The ID of the job to update.
   * @param {Partial<IJob>} updateQuery - The updates to apply.
   * @returns {Promise<void>}
   * @throws {BadRequestError} If the job is not found.
   */
  public async updateJob(
    jobId: number,
    updateQuery: Partial<IJob>
  ): Promise<void> {
    try {
      await this.findJobByIdOrThrow(jobId, 'updateJob');
      await this.jobHelper.updateJob(jobId, updateQuery);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while updating job.',
        {
          module: this.moduleName,
          method: 'updateJob',
          trace: { jobId, error },
        }
      );
    }
  }

  /**
   * Remove a job by ID.
   * @param {number} jobId - The ID of the job to remove.
   * @returns {Promise<void>}
   * @throws {BadRequestError} If the job is not found.
   */
  public async removeJob(jobId: number): Promise<void> {
    try {
      await this.findJobByIdOrThrow(jobId, 'removeJob');
      await this.jobHelper.removeJob(jobId);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while removing job.',
        {
          module: this.moduleName,
          method: 'removeJob',
          trace: { jobId, error },
        }
      );
    }
  }
}