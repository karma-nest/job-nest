/**
 * @fileoverview
 * @module
 * @version
 */

export { IAdmin, IAdminCreation } from './admin.interface';

export {
  IApplication,
  IApplicationCreation,
  IApplicationsQuery,
  IApplicationQuery
} from './application.interface';

export {
  IAuthConfig,
  IRoleAuthConfig,
  IAuthorizationConfig,
  IAdminRegister,
  ICandidateRegister,
  IRecruiterRegister,
} from './auth.interface';

export {
  ICandidate,
  ICandidateQuery,
  ICandidatesQuery,
  ICandidateCreation,
} from './candidate.interface';

export { IDatabaseConfig } from './db.interface';

export { IErrorSource, IErrorDetails } from './error.interface';

export { IJob, IJobQuery, IJobCreation } from './job.interface';

export { IJwtToken } from './jwt.interface';

export { ILoggerConfig } from './logger.interface';

export {
  INotificationConfig,
  INotificationLib,
} from './notification.interface';

export {
  IRecruiter,
  IRecruiterCreation,
  IRecruiterQuery,
  IRecruitersQuery,
} from './recruiter.interface';

export {
  IUser,
  IUserQuery,
  IUpdateContactQuery,
  IUpdatePasswordQuery,
  IUserCreation,
} from './user.interface';
