/**
 * @fileoverview
 * @module
 * @version
 */
import Joi from 'joi';
import {
  IAdminRegister,
  ICandidateRegister,
  IRecruiterRegister,
} from '../interfaces';

const baseRegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  phoneNumber: Joi.string().required().messages({
    'any.required': 'Phone number is required.',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'any.required': 'New password is required.',
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm password must match the new password.',
      'any.required': 'Confirm password is required.',
    }),
});

const adminRegisterSchema = baseRegisterSchema.keys({
  firstName: Joi.string().optional().messages({
    'string.base': 'First name must be a string.',
  }),
  lastName: Joi.string().optional().messages({
    'string.base': 'Last name must be a string.',
  }),
});

const candidateRegisterSchema = baseRegisterSchema.keys({
  firstName: Joi.string().required().messages({
    'string.base': 'First name must be a string.',
    'any.required': 'First name is required.',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'Last name must be a string.',
    'any.required': 'Last name is required.',
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
    .required()
    .messages({
      'string.valid':
        'Title must be one of the following: Mr, Mrs, Ms, Miss, Dr, Prof, Rev, Capt, Sir, Madam, Mx, Rather Not Say.',
      'any.required': 'Title is required.',
    }),
});

const recruiterRegisterSchema = baseRegisterSchema.keys({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string.',
    'any.required': 'Name is required.',
  }),
  industry: Joi.string().required().messages({
    'string.base': 'Industry must be a string.',
    'any.required': 'Industry is required.',
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchemaType = Joi.ObjectSchema<any>;

const registerValidator = (
  role: 'admin' | 'candidate' | 'recruiter',
  registerCreds: IAdminRegister | ICandidateRegister | IRecruiterRegister
): void => {
  let schema: SchemaType;

  switch (role) {
    case 'admin':
      schema = adminRegisterSchema;
      break;
    case 'candidate':
      schema = candidateRegisterSchema;
      break;
    case 'recruiter':
      schema = recruiterRegisterSchema;
      break;
    default:
      throw new Error('Invalid role');
  }

  const { error } = schema.validate(registerCreds);
  if (error) {
    throw error;
  }
};

export {
  adminRegisterSchema,
  candidateRegisterSchema,
  recruiterRegisterSchema,
  registerValidator,
};
