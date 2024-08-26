/**
 * @fileoverview Helper class for managing Candidate operations.
 * @version 1.0.0
 * @module candidateHelper
 */

import { Op, WhereOptions } from 'sequelize';
import { ICandidate, ICandidatesQuery } from '../interfaces';
import { Candidate } from '../models/candidate.model';
import { User } from '../models/user.model';
import { ICandidateDTO, toICandidateDTO } from '../dtos';

export default class CandidateHelper {
  constructor(private readonly candidateModel: typeof Candidate = Candidate) {}

  private buildWhereClause = (
    candidateQuery: ICandidatesQuery
  ): WhereOptions => {
    const whereClause: WhereOptions = {};

    if (candidateQuery.isEmployed !== undefined) {
      whereClause['isEmployed'] = {
        [Op.like]: `%${candidateQuery.isEmployed}%`,
      };
    }

    if (candidateQuery.skills && Array.isArray(candidateQuery.skills)) {
      whereClause['skills'] = {
        [Op.in]: candidateQuery.skills.map((skill) => ({
          [Op.like]: `%${skill}%`,
        })),
      };
    } else if (candidateQuery.skills) {
      whereClause['skills'] = { [Op.like]: `%${candidateQuery.skills}%` };
    }

    return whereClause;
  };

  public createCandidate = async (
    candidateData: ICandidate
  ): Promise<void | null> => {
    try {
      await this.candidateModel.create(candidateData);
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  };

  public getCandidate = async (
    userId: number
  ): Promise<ICandidateDTO | null> => {
    try {
      const candidate = await this.candidateModel.findOne({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        include: [{ model: User, as: 'user' }],
      });
      return toICandidateDTO(candidate);
    } catch (error) {
      console.error('Error retrieving candidate:', error);
      throw error;
    }
  };

  public getCandidates = async (
    filters: Partial<ICandidatesQuery>
  ): Promise<ICandidateDTO[] | null> => {
    try {
      const candidates = await this.candidateModel.findAll({
        where: this.buildWhereClause(filters),
      });

      const candidatesDto = candidates.map((candidate) =>
        toICandidateDTO(candidate)
      );
      return candidatesDto;
    } catch (error) {
      console.error('Error retrieving candidates:', error);
      throw error;
    }
  };

  public updateCandidate = async (
    candidateId: number,
    candidateData: Partial<ICandidate>
  ): Promise<void | null> => {
    try {
      await this.candidateModel.update(candidateData, {
        where: {
          id: {
            [Op.eq]: candidateId,
          },
        },
        returning: true,
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  };

  public removeCandidate = async (
    candidateId: number
  ): Promise<void | null> => {
    try {
      await this.candidateModel.destroy({
        where: {
          id: {
            [Op.eq]: candidateId,
          },
        },
      });
    } catch (error) {
      console.error('Error removing candidate:', error);
      throw error;
    }
  };
}
