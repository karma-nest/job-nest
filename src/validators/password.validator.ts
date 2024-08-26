/**
 * @fileoverview This module provides functions for validating passwords.
 * @version 1.0.0
 * @module passwordsValidator
 */
import Joi from 'joi';
import { compareStrings } from './string.validator';
import { IUpdatePasswordQuery } from '../interfaces';

/**
 * Validates a password against a set of rules and checks if it matches the confirmation password.
 * @param {string} password - The password to validate.
 * @param {string} confirmPassword - The password confirmation to check.
 * @param {(error: Error | null, result: string | null) => void} callback - Callback function to return the result.
 */
const isPassword = (
  password: string,
  confirmPassword: string,
  callback: (error: Error | null, result: string | null) => void
) => {
  if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
    callback(new Error('Invalid input.'), null);
    return;
  }

  const passwordsMatch = compareStrings(password, confirmPassword);

  if (!passwordsMatch) {
    callback(new Error('The passwords entered do not match.'), null);
  } else if (!/[a-z]/.test(password)) {
    callback(
      new Error('Password must contain at least one lowercase letter.'),
      null
    );
  } else if (!/[A-Z]/.test(password)) {
    callback(
      new Error('Password must contain at least one uppercase letter.'),
      null
    );
  } else if (!/(\d)/.test(password)) {
    callback(new Error('Password must contain at least one digit.'), null);
  } else if (password.length < 8) {
    callback(new Error('Password must be at least 8 characters long.'), null);
  } else {
    callback(null, confirmPassword);
  }
};

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.base': 'Current Password should be a text string.',
    'string.empty': 'Please enter your current password.',
    'any.required': 'Current Password is required.',
  }),
  newPassword: Joi.string().required().messages({
    'string.base': 'New Password should be a text string.',
    'string.empty': 'Please enter a new password.',
    'any.required': 'New Password is required.',
  }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'string.base': 'Confirm Password should be a text string.',
      'string.empty': 'Please confirm your new password.',
      'any.required': 'Confirm Password is required.',
      'any.only': 'Confirm Password must match the New Password.',
    }),
});

const validatePasswordUpdate = (
  passwords: IUpdatePasswordQuery
): { error?: Joi.ValidationError } => {
  return updatePasswordSchema.validate(passwords, {
    abortEarly: false,
  });
};

export { isPassword, updatePasswordSchema, validatePasswordUpdate };
