/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Interfaces for authentication and registration configurations.
 * @version 1.0.0
 * @module authTypes
 */

import { IAdmin, ICandidate, IRecruiter } from './';

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
  admin: IRoleAuthConfig;
  candidate: IRoleAuthConfig;
  recruiter: IRoleAuthConfig;
}

interface IAuthorizationConfig {
  token: string;
  role: string;
}

interface IBaseRegister {
  email: string;
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
}

type IAdminRegister = IAdmin & IBaseRegister;
type ICandidateRegister = ICandidate & IBaseRegister;
type IRecruiterRegister = IRecruiter & IBaseRegister;

export {
  IAuthConfig,
  IRoleAuthConfig,
  IAuthorizationConfig,
  IAdminRegister,
  ICandidateRegister,
  IRecruiterRegister,
};
