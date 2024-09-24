/**
 * @fileoverview Utility class for password hashing and validation using Argon2.
 * This class follows the Singleton pattern to ensure only one instance is used.
 * @module PasswordUtil
 * @version 1.0.0
 */

import * as argon2 from 'argon2';
import { authConfig } from '../configs';

type UserRole = 'candidate' | 'recruiter';

class PasswordUtil {
  private static instance: PasswordUtil;

  /**
   * Private constructor to prevent direct instantiation.
   * Use `PasswordUtil.getInstance()` to get the single instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Retrieves the singleton instance of the PasswordUtil class.
   * @returns {PasswordUtil} The single instance of PasswordUtil.
   */
  public static getInstance(): PasswordUtil {
    if (!PasswordUtil.instance) {
      PasswordUtil.instance = new PasswordUtil();
    }
    return PasswordUtil.instance;
  }

  /**
   * Hashes a password using Argon2 with a role-specific pepper.
   * @param {string} password - The plain text password to be hashed.
   * @param {UserRole} role - The role of the user (candidate, or recruiter).
   * @returns {Promise<string>} The hashed password.
   * @throws {Error} Throws an error if password hashing fails.
   */
  public async hashPassword(password: string, role: UserRole): Promise<string> {
    try {
      const secret = Buffer.from(authConfig[role].argon.pepper);

      return await argon2.hash(password, { secret });
    } catch (error) {
      throw new Error(
        `Password hashing failed for role ${role}: ${error.message || error}`
      );
    }
  }

  /**
   * Compares a plain text password with a hashed password using Argon2.
   * @param {string} plainPassword - The plain text password to compare.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @param {UserRole} role - The role of the user (candidate, or recruiter).
   * @returns {Promise<boolean>} Returns true if the passwords match, false otherwise.
   * @throws {Error} Throws an error if password validation fails.
   */
  public async comparePassword(
    plainPassword: string,
    hashedPassword: string,
    role: UserRole
  ): Promise<boolean> {
    try {
      const secret = Buffer.from(authConfig[role].argon.pepper);

      return await argon2.verify(hashedPassword, plainPassword, { secret });
    } catch (error) {
      throw new Error(
        `Password validation failed for role ${role}: ${error.message || error}`
      );
    }
  }
}

export const passwordUtil = PasswordUtil.getInstance();
