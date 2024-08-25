/**
 * @fileoverview Maps IRecruiter to IRecruiterDTO
 * @module recruiterMapper
 * @version 1.0.0
 */
import { IRecruiter } from '../interfaces';
import { IUserDTO } from './user.dto';

interface IRecruiterDTO {
  id: number;
  name: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size: number;
  foundedIn: number;
  isVerified: boolean;
  user: IUserDTO;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps an IRecruiter object to an IRecruiterDTO.
 * @param {IRecruiter} recruiter - The recruiter object to be mapped.
 * @returns {IRecruiterDTO} - The mapped recruiter DTO.
 */
const toIRecruiterDTO = (recruiter: IRecruiter): IRecruiterDTO => ({
  id: recruiter.id,
  name: recruiter.name,
  industry: recruiter.industry,
  websiteUrl: recruiter.websiteUrl,
  location: recruiter.location,
  description: recruiter.description,
  size: recruiter.size,
  foundedIn: recruiter.foundedIn,
  isVerified: recruiter.isVerified,
  user: {
    id: recruiter.user.id,
    avatarUrl: recruiter.user.avatarUrl,
    email: recruiter.user.email,
    mobileNumber: recruiter.user.mobileNumber,
    role: recruiter.user.role,
    isVerified: recruiter.user.isVerified,
    password: '',
  },
  createdAt: recruiter.createdAt,
  updatedAt: recruiter.updatedAt,
});

export { IRecruiterDTO, toIRecruiterDTO };
