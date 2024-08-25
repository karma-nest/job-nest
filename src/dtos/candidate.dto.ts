/**
 * @fileoverview Maps ICandidate to ICandidateDTO
 * @module candidateMapper
 * @version 1.0.0
 */
import { ICandidate } from '../interfaces';
import { IUserDTO } from './user.dto';

interface ICandidateDTO {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  skills: string[];
  isEmployed: boolean;
  user: IUserDTO;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps an ICandidate object to an ICandidateDTO.
 * @param {ICandidate} candidate - The candidate object to be mapped.
 * @returns {ICandidateDTO} - The mapped candidate DTO.
 */
const toICandidateDTO = (candidate: ICandidate): ICandidateDTO => ({
  id: candidate.id,
  firstName: candidate.firstName,
  lastName: candidate.lastName,
  title: candidate.title,
  skills: candidate.skills,
  isEmployed: candidate.isEmployed,
  user: {
    id: candidate.user.id,
    avatarUrl: candidate.user.avatarUrl,
    email: candidate.user.email,
    mobileNumber: candidate.user.mobileNumber,
    role: candidate.user.role,
    isVerified: candidate.user.isVerified,
    password: '',
  },
  createdAt: candidate.createdAt,
  updatedAt: candidate.updatedAt,
});

export { ICandidateDTO, toICandidateDTO };
