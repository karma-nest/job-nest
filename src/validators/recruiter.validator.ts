/**
 * @fileoverview
 * @module
 * @version
 */
import { IRecruiter } from '../interfaces';
import Joi from 'joi';

export const recruiterSchema = Joi.object({
  name: Joi.string().max(255).optional().messages({
    'string.base': 'Name must be a string.',
    'string.max': 'Name must be less than or equal to 255 characters.',
  }),
  industry: Joi.string().max(255).optional().messages({
    'string.base': 'Industry must be a string.',
    'string.max': 'Industry must be less than or equal to 255 characters.',
  }),
  websiteUrl: Joi.string().uri().optional().messages({
    'string.base': 'Website URL must be a string.',
    'string.uri': 'Website URL must be a valid URI.',
  }),
  location: Joi.string().max(255).optional().messages({
    'string.base': 'Location must be a string.',
    'string.max': 'Location must be less than or equal to 255 characters.',
  }),
  description: Joi.string().max(1000).optional().messages({
    'string.base': 'Description must be a string.',
    'string.max': 'Description must be less than or equal to 1000 characters.',
  }),
  size: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Size must be a number.',
    'number.integer': 'Size must be an integer.',
    'number.min': 'Size must be at least 1.',
  }),

  foundedIn: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      'number.base': 'Founded in must be a number.',
      'number.integer': 'Founded in must be an integer.',
      'number.min': 'Founded in must be at least 1800.',
      'number.max': `Founded in must be less than or equal to the current year (${new Date().getFullYear()}).`,
    }),

  isVerified: Joi.boolean().optional().messages({
    'boolean.base': 'Is Verified must be a boolean.',
  }),
});

const validateRecruiter = (data: Partial<IRecruiter>) => {
  const { error, value } = recruiterSchema.validate(data, {
    abortEarly: false,
  });
  return { error, value };
};

export { validateRecruiter };
