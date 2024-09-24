/**
 * @fileoverview
 * @module
 * @version
 */
import { Application } from './application.model';
import { Candidate } from './candidate.model';
import { Job } from './job.model';
import { Recruiter } from './recruiter.model';
import { User } from './user.model';

const models = {
  Application,
  Candidate,
  Job,
  Recruiter,
  User,
};

const associateModels = () => {
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });
};

export { associateModels, models };
