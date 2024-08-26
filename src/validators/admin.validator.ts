import Joi from 'joi';
import { IAdmin } from '../interfaces';

/**
 * Schema for validating Admin fields.
 */
const adminValidator = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .optional()
    .messages({
      'string.base': 'First name should be a string',
      'string.empty': 'First name cannot be empty',
      'string.pattern.base': 'First name can only contain letters',
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .optional()
    .messages({
      'string.base': 'Last name should be a string',
      'string.empty': 'Last name cannot be empty',
      'string.pattern.base': 'Last name can only contain letters',
    }),
});

/**
 * Validate Admin data.
 * @param {object} data - Data to validate
 * @returns {object} - Result of validation
 */
const validateAdmin = (data: Partial<IAdmin>) => {
  const { error, value } = adminValidator.validate(data, { abortEarly: false });
  return { error, value };
};

export { validateAdmin };
