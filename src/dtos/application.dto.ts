/**
 * @fileoverview
 * @module
 * @version
 */

import { ApplicationStatus } from '../types';
import { IApplication } from '../interfaces';

interface IApplicationDTO {
  id: number;
  job: {
    id: number;
    title: string;
    recruiter: {
      id: number;
      name: string;
      email: string;
    };
  };
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    user: {
      avatarUrl: object;
      email: string;
    };
  };
  status: ApplicationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const toIApplicationDTO = (application: IApplication): IApplicationDTO => ({
  id: application['id'],
  job: {
    id: application.job.id,
    title: application.job.title,
    recruiter: {
      id: application.job.recruiter.id,
      name: application.job.recruiter.name,
      email: application.job.recruiter.user.email,
    },
  },
  candidate: {
    id: application.candidate.id,
    firstName: application.candidate.firstName,
    lastName: application.candidate.lastName,
    user: {
      avatarUrl: application.candidate.user.avatarUrl,
      email: application.candidate.user.email,
    },
  },
  status: application.status,
});

export { IApplicationDTO, toIApplicationDTO };
