/**
 * @fileoverview Maps IAdmin to IAdminDTO
 * @module adminMapper
 * @version 1.0.0
 */
import { IAdmin } from '../interfaces';
import { IUserDTO } from './user.dto';

interface IAdminDTO {
  id: number;
  firstName: string;
  lastName: string;
  user: IUserDTO;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps an IAdmin object to an IAdminDTO.
 * @param {IAdmin} admin - The admin object to be mapped.
 * @returns {IAdminDTO} - The mapped admin DTO.
 */
const toIAdminDTO = (admin: IAdmin): IAdminDTO => ({
  id: admin.id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  user: {
    id: admin.user.id,
    avatarUrl: admin.user.avatarUrl,
    email: admin.user.email,
    mobileNumber: admin.user.mobileNumber,
    role: admin.user.role,
    isVerified: admin.user.isVerified,
    password: '',
  },
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

export { IAdminDTO, toIAdminDTO };
