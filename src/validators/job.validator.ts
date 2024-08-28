/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';
import { IJob } from '../interfaces';

const jobSchema = {
  create: Joi.object({
    title: Joi.string().required().messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be an empty field.',
      'any.required': 'Title is a required field.',
    }),
    description: Joi.string().required().messages({
      'string.base': 'Description should be a type of text.',
      'string.empty': 'Description cannot be an empty field.',
      'any.required': 'Description is a required field.',
    }),
    responsibility: Joi.string().required().messages({
      'string.base': 'Responsibility should be a type of text.',
      'string.empty': 'Responsibility cannot be an empty field.',
      'any.required': 'Responsibility is a required field.',
    }),
    requirements: Joi.array()
      .items(Joi.string().required())
      .required()
      .messages({
        'array.base': 'Requirements should be an array of strings.',
        'array.includesRequiredUnknowns':
          'Each requirement must be a valid string.',
        'any.required': 'Requirements are required.',
      }),
    benefits: Joi.array().items(Joi.string()).required().messages({
      'array.base': 'Benefits should be an array of strings.',
      'array.includes': 'Each benefit must be a valid string.',
    }),
    location: Joi.string().required().messages({
      'string.base': 'Location should be a type of text.',
      'string.empty': 'Location cannot be an empty field.',
      'any.required': 'Location is a required field.',
    }),
    type: Joi.string()
      .valid('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship')
      .required()
      .messages({
        'string.base': 'Type should be a type of text.',
        'any.only':
          'Type must be one of the following: Full-time, Part-time, Contract, Freelance, Internship.',
        'any.required': 'Type is a required field.',
      }),
    vacancy: Joi.number().required().messages({
      'number.base': 'Vacancy should be a type of number.',
    }),
    deadline: Joi.date().required().messages({
      'date.base': 'Deadline should be a valid date.',
      'any.required': 'Deadline is a required field.',
    }),
    tags: Joi.array().items(Joi.string().required()).required().messages({
      'array.base': 'Tags should be an array of strings.',
      'array.includesRequiredUnknowns': 'Each tag must be a valid string.',
      'any.required': 'Tags are required.',
    }),
  }),
  update: Joi.object({
    title: Joi.string().optional().messages({
      'string.base': 'Title should be a type of text.',
      'string.empty': 'Title cannot be an empty field.',
    }),
    description: Joi.string().optional().messages({
      'string.base': 'Description should be a type of text.',
      'string.empty': 'Description cannot be an empty field.',
    }),
    responsibility: Joi.string().optional().messages({
      'string.base': 'Responsibility should be a type of text.',
      'string.empty': 'Responsibility cannot be an empty field.',
    }),
    requirements: Joi.array()
      .items(Joi.string().optional())
      .optional()
      .messages({
        'array.base': 'Requirements should be an array of strings.',
        'array.includesRequiredUnknowns':
          'Each requirement must be a valid string.',
      }),
    benefits: Joi.array().items(Joi.string()).optional().messages({
      'array.base': 'Benefits should be an array of strings.',
      'array.includes': 'Each benefit must be a valid string.',
    }),
    location: Joi.string().optional().messages({
      'string.base': 'Location should be a type of text.',
      'string.empty': 'Location cannot be an empty field.',
    }),
    type: Joi.string()
      .valid('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship')
      .optional()
      .messages({
        'string.base': 'Type should be a type of text.',
        'any.only':
          'Type must be one of the following: Full-time, Part-time, Contract, Freelance, Internship.',
      }),
    vacancy: Joi.number().optional().messages({
      'number.base': 'Vacancy should be a type of number.',
    }),
    deadline: Joi.date().optional().messages({
      'date.base': 'Deadline should be a valid date.',
    }),
    tags: Joi.array().items(Joi.string().optional()).optional().messages({
      'array.base': 'Tags should be an array of strings.',
      'array.includesRequiredUnknowns': 'Each tag must be a valid string.',
    }),
    views: Joi.number().optional().messages({
      'number.base': 'Views should be a type of number.',
    }),
    isActive: Joi.boolean().optional().messages({
      'boolean.base': 'Is Active should be a type of boolean.',
    }),
    createdAt: Joi.date().optional().messages({
      'date.base': 'Created At should be a valid date.',
    }),
    updatedAt: Joi.date().optional().messages({
      'date.base': 'Updated At should be a valid date.',
    }),
  }),
};

export const jobValidator = {
  create: (data: Partial<IJob>) => {
    const { error, value } = jobSchema.create.validate(data, {
      abortEarly: false,
    });
    return { error, value };
  },
  update: (data: Partial<IJob>) => {
    const { error, value } = jobSchema.update.validate(data, {
      abortEarly: false,
    });
    return { error, value };
  },
};
