/**
 * @fileoverview This service handles candidate-related operations such as retrieving profiles, updating details, and removing profiles.
 * @module CandidateService
 * @version 1.0.0
 */
import { ICandidateDTO } from '../dtos';
import { CandidateHelper, UserHelper } from '../helpers';
import { ICandidate } from '../interfaces';
import { CreateErrorUtil } from '../utils';

export default class CandidateService {
  private readonly moduleName: string;
  private readonly candidateHelper: CandidateHelper;
  private readonly userHelper: UserHelper;
  private readonly errorUtil: CreateErrorUtil;

  /**
   * Creates an instance of CandidateService.
   * @param {string} moduleName - The name of the module.
   */
  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.candidateHelper = new CandidateHelper();
    this.userHelper = new UserHelper();
    this.errorUtil = new CreateErrorUtil();
  }

  /**
   * Retrieves the profile of a candidate by user ID.
   * @param {number} userId - The ID of the user whose candidate profile is being retrieved.
   * @throws {NotFoundError} If the candidate profile is not found.
   * @throws {InternalServerError} If an unexpected error occurs during the retrieval.
   * @returns {Promise<ICandidateDTO>} The candidate profile data transfer object.
   */
  public getProfile = async (userId: number): Promise<ICandidateDTO> => {
    try {
      const foundCandidate = await this.candidateHelper.getCandidate(userId);
      if (!foundCandidate) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while loading the candidate profile.',
          {
            module: this.moduleName,
            method: 'getProfile',
            trace: {
              error: 'User document not found.',
              log: userId,
            },
          }
        );
      }

      return foundCandidate;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while loading the candidate profile.',
        {
          module: this.moduleName,
          method: 'getProfile',
          trace: { error: error.message, log: userId },
        }
      );
    }
  };

  /**
   * Updates the profile of a candidate by user ID.
   * @param {number} userId - The ID of the user whose candidate profile is being updated.
   * @param {Partial<ICandidate>} updateProfileQuery - The profile details to update.
   * @throws {NotFoundError} If the candidate profile is not found.
   * @throws {InternalServerError} If an unexpected error occurs during the update.
   * @returns {Promise<void>}
   */
  public updateProfile = async (
    userId: number,
    updateProfileQuery: Partial<ICandidate>
  ): Promise<void> => {
    try {
      const foundCandidate = await this.candidateHelper.getCandidate(userId);
      if (!foundCandidate) {
        throw this.errorUtil.createNotFoundError(
          'An unexpected error occurred while updating the profile.',
          {
            module: this.moduleName,
            method: 'updateProfile',
            trace: {
              error: 'Candidate document not found.',
              log: userId,
            },
          }
        );
      }

      await this.candidateHelper.updateCandidate(
        foundCandidate['id'],
        updateProfileQuery
      );
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while updating the profile.',
        {
          module: this.moduleName,
          method: 'updateProfile',
          trace: { error: error.message, log: userId },
        }
      );
    }
  };
}
