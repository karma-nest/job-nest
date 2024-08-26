/**
 * @fileoverview
 * @module
 * @version
 */
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ResponseUtil } from '../utils';
import { CandidateService } from '../services';
import { ICandidate } from '../interfaces';
import { validateCandidate } from '../validators';

export default class CandidateController extends ResponseUtil {
  private readonly candidateService: CandidateService;

  constructor() {
    super('admin');
    this.candidateService = new CandidateService('candidate.controller');
  }

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id }: { id: number } = req.app.locals.user;

      const payload = await this.candidateService.getProfile(id);

      return this.response(res, StatusCodes.OK, payload);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id }: { id: number } = req.app.locals.user;
      const updateData = req.body as Partial<ICandidate>;

      const { error } = validateCandidate(updateData);
      if (error) {
        return this.unprocessableEntity(res, error.details[0].message);
      }

      await this.candidateService.updateProfile(id, updateData);

      return this.response(res, StatusCodes.NO_CONTENT, undefined);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
