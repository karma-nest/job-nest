/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';
import { IUpdateContactQuery } from '../interfaces';

export const updateContactSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.base': 'Email should be a type of text.',
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email cannot be empty.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .optional()
    .messages({
      'string.base': 'Phone Number should be a type of text.',
      'string.pattern.base': 'Phone Number can only contain numbers.',
      'string.empty': 'Phone Number cannot be empty.',
    }),
});

export const validateContactUpdate = (
  contact: IUpdateContactQuery
): { error?: Joi.ValidationError } => {
  return updateContactSchema.validate(contact, {
    abortEarly: false,
  });
};
