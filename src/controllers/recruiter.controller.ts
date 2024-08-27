/**
 * @fileoverview
 * @module
 * @version
 */
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils';
import RecruiterService from '../services/recruiter.service';
import { IRecruiter, IRecruitersQuery } from '../interfaces';
import { validateRecruiter } from '../validators/recruiter.validator';

export default class RecruiterController extends ResponseUtil {
  private readonly recruiterService: RecruiterService;

  constructor() {
    super('recruiter');
    this.recruiterService = new RecruiterService('recruiter.controller');
  }

  public getRecruiter = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id }: { id: number } = req.app.locals.user;

      const payload = await this.recruiterService.getRecruiter(id);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getRecruiters = async (req: Request, res: Response): Promise<void> => {
    try {
      const filterQuery = req.query as IRecruitersQuery;

      const payload = await this.recruiterService.getRecruiters(filterQuery);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id }: { id: number } = req.app.locals.user;
      const updateData = req.body as Partial<IRecruiter>;

      const { error } = validateRecruiter(updateData);
      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.recruiterService.updateProfile(id, updateData);

      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
