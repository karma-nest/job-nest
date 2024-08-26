/**
 * @fileoverview Defines a Joi validator for candidate-related data.
 * @module CandidateValidator
 * @version 1.0.0
 */

import { ICandidate } from '../interfaces';
import Joi from 'joi';

const candidateValidator = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .max(50)
    .optional()
    .messages({
      'string.base': 'First name should be a string.',
      'string.empty': 'First name cannot be empty.',
      'string.pattern.base': 'First name must only contain letters.',
      'string.max': 'First name must be at most 50 characters long.',
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .max(50)
    .optional()
    .messages({
      'string.base': 'Last name should be a string.',
      'string.empty': 'Last name cannot be empty.',
      'string.pattern.base': 'Last name must only contain letters.',
      'string.max': 'Last name must be at most 50 characters long.',
    }),
  title: Joi.string()
    .valid(
      'Mr',
      'Mrs',
      'Ms',
      'Miss',
      'Dr',
      'Prof',
      'Rev',
      'Capt',
      'Sir',
      'Madam',
      'Mx',
      'Rather Not Say'
    )
    .optional()
    .messages({
      'any.only':
        'Title must be one of [Mr, Mrs, Ms, Miss, Dr, Prof, Rev, Capt, Sir, Madam, Mx, Rather Not Say]',
      'any.required': 'Title is required.',
    }),
  skills: Joi.array()
    .items(
      Joi.string().max(100).messages({
        'string.max': 'Each skill must be at most 100 characters long.',
      })
    )
    .optional()
    .messages({
      'array.base': 'Skills must be an array of strings.',
    }),
  isEmployed: Joi.boolean().optional().messages({
    'boolean.base': 'Employment status must be a boolean value.',
  }),
});

/**
 * Function to validate candidate data.
 * @param {Partial<ICandidate>} data - The candidate data to validate.
 * @returns {{ error: Joi.ValidationError | undefined, value?: Partial<ICandidate> }} The result of validation.
 */
const validateCandidate = (data: Partial<ICandidate>) => {
  const { error, value } = candidateValidator.validate(data, {
    abortEarly: false,
  });
  return { error, value };
};

export { validateCandidate };
