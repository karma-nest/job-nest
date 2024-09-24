/**
 * @fileoverview Maps IUser to IUserDTO
 * @module userMapper
 * @version 1.0.0
 */

import { IUser } from '../interfaces';

interface IUserDTO {
  id: number;
  avatarUrl: string;
  email: string;
  mobileNumber: string;
  role: 'candidate' | 'recruiter';
  isVerified: boolean;
  password: string;
}

/**
 * Maps an IUser object to an IUserDTO.
 * @param {IUser} user - The user object to be mapped.
 * @returns {IUserDTO} - The mapped user DTO.
 */
const toIUserDTO = (user: IUser): IUserDTO => ({
  id: user?.id,
  avatarUrl: user?.avatarUrl,
  email: user?.email,
  mobileNumber: user?.mobileNumber,
  role: user?.role,
  isVerified: user?.isVerified,
  password: user?.password,
});

export { IUserDTO, toIUserDTO };
