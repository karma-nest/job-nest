/**
 * @fileoverview
 * @module
 * @version
 */

import { IApplication } from '../interfaces';

interface IApplicationDTO {
  id: number;
  job: {
    id: number;
    title: string | null;
    recruiter: {
      id: number;
      name: string | null;
    };
  };
  candidate: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    user: {
      avatarUrl: object;
      email: string;
    };
  };
  status: string | null;
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
  status: application['status'],
});

export { IApplicationDTO, toIApplicationDTO };
