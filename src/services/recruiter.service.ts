/**
 * @fileoverview This service handles candidate-related operations such as retrieving profiles, updating details, and removing profiles.
 * @module CandidateService
 * @version 1.0.0
 */
import { RecruiterHelper, UserHelper } from '../helpers';
import { IRecruiter, IRecruitersQuery } from '../interfaces';
import { CreateErrorUtil } from '../utils';
import { IRecruiterDTO } from '../dtos/recruiter.dto';

export default class RecruiterService {
  private readonly moduleName: string;
  private readonly recruiterHelper: RecruiterHelper;
  private readonly userHelper: UserHelper;
  private readonly errorUtil: CreateErrorUtil;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.recruiterHelper = new RecruiterHelper();
    this.userHelper = new UserHelper();
    this.errorUtil = new CreateErrorUtil();
  }

  public getRecruiter = async (userId: number): Promise<IRecruiterDTO> => {
    try {
      const foundRecruiter = await this.recruiterHelper.getRecruiter({
        userId,
      });
      if (!foundRecruiter) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while loading the recruiter profile.',
          {
            module: this.moduleName,
            method: 'getRecruiter',
            trace: {
              error: 'User document not found.',
              log: userId,
            },
          }
        );
      }

      return foundRecruiter;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while loading the recruiter profile.',
        {
          module: this.moduleName,
          method: 'getRecruiter',
          trace: { error: error.message, log: userId },
        }
      );
    }
  };

  public getRecruiters = async (
    filterQuery: IRecruitersQuery
  ): Promise<IRecruiterDTO[]> => {
    try {
      const recruiters = this.recruiterHelper.getRecruiters(filterQuery);
      if (!recruiters) {
        throw this.errorUtil.createNotFoundError(
          'Sorry, not recruiters found at the moment.',
          {
            module: this.moduleName,
            method: 'getRecruiters',
            trace: {
              error: 'Recruiters documents not found.',
              log: filterQuery,
            },
          }
        );
      }

      return recruiters;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while loading recruiters..',
        {
          module: this.moduleName,
          method: 'getRecruiters',
          trace: { error: error.message },
        }
      );
    }
  };

  public updateProfile = async (
    userId: number,
    updateProfileQuery: Partial<IRecruiter>
  ): Promise<void> => {
    try {
      const foundRecruiter = await this.recruiterHelper.getRecruiter({
        userId,
      });
      if (!foundRecruiter) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while updating profile.',
          {
            module: this.moduleName,
            method: 'updateProfile',
            trace: {
              error: 'User document not found.',
              log: userId,
            },
          }
        );
      }

      await this.recruiterHelper.updateRecruiter(
        foundRecruiter['id'],
        updateProfileQuery
      );
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while updating profile.',
        {
          module: this.moduleName,
          method: 'updateProfile',
          trace: { error: error.message, log: userId },
        }
      );
    }
  };
}
