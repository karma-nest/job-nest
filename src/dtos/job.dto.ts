/**
 * @fileoverview Maps IJob to IJobDTO
 * @module jobMapper
 * @version 1.0.0
 */
import { IJob } from '../interfaces';

interface IJobDTO {
  id: number;
  title: string;
  description: string;
  responsibility: string;
  requirements: string[];
  benefits: string[];
  location: string | null;
  type: string;
  vacancy: number;
  deadline: Date;
  tags: string[];
  views: number;
  isActive: boolean;
  recruiter: {
    id: number;
    name: string;
    industry: string;
    websiteUrl?: string | null;
    location?: string | null;
    description?: string | null;
    size?: number | null;
    foundedIn?: number | null;
    isVerified?: boolean | null;
    user: {
      avatarUrl?: string | null;
      email: string;
      mobileNumber: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps an IJob object to an IJobDTO.
 * @param {IJob} job - The job object to be mapped.
 * @returns {IJobDTO} - The mapped job DTO.
 */
const toIJobDTO = (job: IJob): IJobDTO => ({
  id: job.id,
  title: job.title,
  description: job.description,
  responsibility: job.responsibility,
  requirements: job.requirements,
  benefits: job.benefits,
  location: job.location,
  type: job.type,
  vacancy: job.vacancy,
  deadline: job.deadline,
  tags: job.tags,
  views: job.views,
  isActive: job.isActive,
  recruiter: {
    id: job.recruiterId,
    name: job.recruiter.name,
    industry: job.recruiter.industry,
    websiteUrl: job.recruiter.websiteUrl,
    location: job.recruiter.location,
    description: job.recruiter.description,
    size: job.recruiter.size,
    foundedIn: job.recruiter.foundedIn,
    isVerified: job.recruiter.isVerified,
    user: {
      avatarUrl: job.recruiter.user.avatarUrl,
      email: job.recruiter.user.email,
      mobileNumber: job.recruiter.user.mobileNumber,
    },
  },
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

export { IJobDTO, toIJobDTO };
