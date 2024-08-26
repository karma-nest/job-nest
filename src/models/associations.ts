/**
 * @fileoverview
 * @module
 * @version
 */
import { Admin } from './admin.model';
import { Candidate } from './candidate.model';
import { Recruiter } from './recruiter.model';
import { User } from './user.model';

const models = {
  Admin,
  Candidate,
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

export { associateModels };
