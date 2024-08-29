/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';
import { IApplicationsQuery } from 'src/interfaces';

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
    .valid('Approved', 'Shortlisted', 'Rejected')
    .required()
    .label('Application Status')
    .messages({
      'any.required': '"Application Status" is required for update',
      'any.only': '{{#label}} must be one of [Approved, Shortlisted, Rejected]',
      'string.base': '"Application Status" must be a string',
      'string.empty': '"Application Status" cannot be empty',
    }),
});

const validateCreateApplication = (data: IApplicationsQuery) => {
  const { error, value } = applicationSchema.validate(data, {
    abortEarly: false,
  });

  return { error, value };
};

const validateUpdateApplication = (status: string) => {
  const { error, value } = updateApplicationSchema.validate(
    { status },
    { abortEarly: false }
  );

  return { error, value };
};

export { validateCreateApplication, validateUpdateApplication };
