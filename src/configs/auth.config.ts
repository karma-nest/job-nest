/**
 * @fileoverview Configuration for authentication and authorization tokens.
 * @version 1.0.0
 * @module authConfig
 */
import { IAuthConfig, IRoleAuthConfig } from '../interfaces';

const getRoleAuthConfig = (role: string): IRoleAuthConfig => ({
  jwt: {
    accessToken: process.env[`${role}_ACCESS_KEY`] || '',
    activationToken: process.env[`${role}_ACTIVATION_KEY`] || '',
    passwordToken: process.env[`${role}_PASSWORD_KEY`] || '',
  },
  argon: {
    pepper: process.env[`${role}_PEPPER`] || '',
  },
});

export const authConfig: IAuthConfig = {
  admin: getRoleAuthConfig('ADMIN'),
  candidate: getRoleAuthConfig('CANDIDATE'),
  recruiter: getRoleAuthConfig('RECRUITER'),
};
