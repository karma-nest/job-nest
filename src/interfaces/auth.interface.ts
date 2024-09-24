/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Interfaces for authentication and registration configurations.
 * @version 1.0.0
 * @module authTypes
 */

import { ICandidate, IRecruiter } from './';

interface IJwtConfig {
  accessToken: string;
  activationToken: string;
  passwordToken: string;
}

interface IArgonConfig {
  pepper: string;
}

interface IRoleAuthConfig {
  jwt: IJwtConfig;
  argon: IArgonConfig;
}

interface IAuthConfig {
  candidate: IRoleAuthConfig;
  recruiter: IRoleAuthConfig;
}

interface IAuthorizationConfig {
  token: string;
  role: string;
  subdomain: string;
}

interface IBaseRegister {
  email: string;
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
}

type ICandidateRegister = ICandidate & IBaseRegister;
type IRecruiterRegister = IRecruiter & IBaseRegister;

export {
  IAuthConfig,
  IRoleAuthConfig,
  IAuthorizationConfig,
  ICandidateRegister,
  IRecruiterRegister,
};
