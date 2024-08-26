/**
 * @fileoverview Provides services for managing admin profiles.
 * @version 1.0.0
 * @module AdminService
 */
import { IAdminDTO } from '../dtos';
import { AdminHelper } from '../helpers';
import { IAdmin } from '../interfaces';
import { CreateErrorUtil } from '../utils';

export default class AdminService {
  private readonly moduleName: string;
  private readonly adminHelper: AdminHelper;
  private readonly errorUtil: CreateErrorUtil;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
    this.adminHelper = new AdminHelper();
    this.errorUtil = new CreateErrorUtil();
  }

  public getAdmin = async (userId: number): Promise<IAdminDTO> => {
    try {
      const foundAdmin = await this.adminHelper.getAdmin(userId);
      if (!foundAdmin) {
        throw this.errorUtil.createNotFoundError('Admin profile not found.', {
          module: this.moduleName,
          method: 'getAdmin',
          trace: {
            error: 'Admin document not found.',
            log: userId,
          },
        });
      }

      return foundAdmin;
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while loading the admin profile.',
        {
          module: this.moduleName,
          method: 'getAdmin',
          trace: {
            error: error.message,
            log: userId,
          },
        }
      );
    }
  };

  public updateAdmin = async (
    userId: number,
    updateQuery: Partial<IAdmin>
  ): Promise<void> => {
    try {
      const foundAdmin = await this.adminHelper.getAdmin(userId);
      if (!foundAdmin) {
        throw this.errorUtil.createNotFoundError('Admin profile not found.', {
          module: this.moduleName,
          method: 'updateAdmin',
          trace: {
            error: 'Admin document not found.',
            log: userId,
          },
        });
      }

      await this.adminHelper.updateAdmin(userId, updateQuery);
    } catch (error) {
      throw this.errorUtil.createInternalServerError(
        'An unexpected error occurred while updating the admin profile.',
        {
          module: this.moduleName,
          method: 'updateAdmin',
          trace: {
            error: error.message,
            log: userId,
          },
        }
      );
    }
  };
}
