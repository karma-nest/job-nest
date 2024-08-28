/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';
import { IApplicationsQuery } from 'src/interfaces';
import { ApplicationStatus } from 'src/types';

const applicationSchema = Joi.object({
  jobId: Joi.number().integer().required().messages({
    'number.base': 'jobId must be a number',
    'number.integer': 'jobId must be an integer',
    'any.required': 'jobId is required',
  }),
  candidateId: Joi.number().integer().required().messages({
    'number.base': 'candidateId must be a number',
    'number.integer': 'candidateId must be an integer',
    'any.required': 'candidateId is required',
  }),
});

const updateApplicationSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Approved', 'Shortlisted', 'Rejected')
    .required()
    .messages({
      'any.only':
        'Status must be one of [Pending, Approved, Shortlisted, Rejected]',
      'any.required': 'Status is required for update',
    }),
});

const validateCreateApplication = (data: IApplicationsQuery) => {
  const { error, value } = applicationSchema.validate(data, {
    abortEarly: false,
  });

  return { error, value };
};

const validateUpdateApplication = (status: string) => {
  const { error, value } = updateApplicationSchema.validate(status, {
    abortEarly: false,
  });

  return { error, value };
};

export { validateCreateApplication, validateUpdateApplication };
