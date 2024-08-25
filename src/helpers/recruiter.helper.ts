/**
 * @fileoverview Helper functions for Recruiter operations
 * @version 1.0.0
 * @module recruiterHelper
 */

import { Op, WhereOptions } from 'sequelize';
import { IRecruiter } from '../interfaces';
import { Recruiter } from '../models/recruiter.model';
import { IRecruiterQuery, IRecruitersQuery } from '../interfaces';
import { User } from '../models/user.model';
import { IRecruiterDTO, toIRecruiterDTO } from '../dtos';

export default class RecruiterHelper {
  constructor(private readonly recruiterModel: typeof Recruiter = Recruiter) {}

  private buildWhereClause = (
    recruitersQuery: IRecruitersQuery
  ): WhereOptions => {
    const whereClause: WhereOptions = {};

    if (recruitersQuery.name) {
      whereClause['name'] = { [Op.like]: `%${recruitersQuery.name}%` };
    }
    if (recruitersQuery.industry) {
      whereClause['industry'] = { [Op.like]: `%${recruitersQuery.industry}%` };
    }
    if (recruitersQuery.location) {
      whereClause['location'] = { [Op.like]: `%${recruitersQuery.location}%` };
    }
    if (recruitersQuery.isVerified !== undefined) {
      whereClause['isVerified'] = recruitersQuery.isVerified;
    }

    return whereClause;
  };

  public createRecruiter = async (
    recruiterData: IRecruiter
  ): Promise<void | null> => {
    try {
      await this.recruiterModel.create(recruiterData);
    } catch (error) {
      console.error('Error creating recruiter', error);
      throw error;
    }
  };

  public getRecruiter = async (
    recruiterQuery: IRecruiterQuery
  ): Promise<IRecruiterDTO | null> => {
    try {
      const recruiter = await this.recruiterModel.findOne({
        where: {
          [Op.or]: [
            { id: { [Op.eq]: recruiterQuery.id } },
            { userId: { [Op.eq]: recruiterQuery.userId } },
          ],
        },
        include: [{ model: User, as: 'user' }],
      });

      return toIRecruiterDTO(recruiter);
    } catch (error) {
      console.error('Error retrieving recruiter', error);
      throw error;
    }
  };

  public getRecruiters = async (
    recruitersQuery: IRecruitersQuery
  ): Promise<IRecruiterDTO[] | null> => {
    try {
      const recruiters = await this.recruiterModel.findAll({
        where: this.buildWhereClause(recruitersQuery),
      });

      const recruitersDto = recruiters.map((recruiter) =>
        toIRecruiterDTO(recruiter)
      );
      return recruitersDto;
    } catch (error) {
      console.error('Error retrieving recruiters', error);
      throw error;
    }
  };

  public updateRecruiter = async (
    recruiterId: number,
    updatequery: Partial<IRecruiter>
  ): Promise<void | null> => {
    try {
      await this.recruiterModel.update(updatequery, {
        where: { id: { [Op.eq]: recruiterId } },
      });
    } catch (error) {
      console.error('Error updating recruiter:', error);
      throw error;
    }
  };

  public removeRecruiter = async (
    recruiterId: number
  ): Promise<void | null> => {
    try {
      await this.recruiterModel.destroy({
        where: { id: { [Op.eq]: recruiterId } },
      });
    } catch (error) {
      console.error('Error removing recruiter:', error);
      throw error;
    }
  };
}
