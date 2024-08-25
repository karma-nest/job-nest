/**
 * @fileoverview
 * @version
 * @module
 */
import {
  adminRegisterSchema,
  candidateRegisterSchema,
  recruiterRegisterSchema,
} from './register.validator';

describe('', () => {
  // admin auth validator
  describe('adminRegisterSchema', () => {
    it('should validate a valid admin register object', () => {
      const validAdminRegister = {
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const { error } = adminRegisterSchema.validate(validAdminRegister);
      expect(error).toBeUndefined();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidAdminRegister = {
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        // confirmPassword is missing
      };

      const { error } = adminRegisterSchema.validate(invalidAdminRegister);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('Confirm password is required.');
    });

    it('should invalidate an object with incorrect email format', () => {
      const invalidAdminRegister = {
        email: 'invalid-email',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
      };

      const { error } = adminRegisterSchema.validate(invalidAdminRegister);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Please provide a valid email address.'
      );
    });

    it('should invalidate an object with non-matching passwords', () => {
      const invalidAdminRegister = {
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'differentPassword',
      };

      const { error } = adminRegisterSchema.validate(invalidAdminRegister);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Confirm password must match the new password.'
      );
    });

    it('should validate optional fields when provided', () => {
      const validAdminRegister = {
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const { error } = adminRegisterSchema.validate(validAdminRegister);
      expect(error).toBeUndefined();
    });
  });
  // candidate auth validator
  describe('candidateRegisterSchema', () => {
    it('should validate a valid candidate register object', () => {
      const validCandidateRegister = {
        email: 'candidate@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'Ms',
      };

      const { error } = candidateRegisterSchema.validate(
        validCandidateRegister
      );
      expect(error).toBeUndefined();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidCandidateRegister = {
        email: 'candidate@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        // confirmPassword is missing
      };

      const { error } = candidateRegisterSchema.validate(
        invalidCandidateRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('Confirm password is required.');
    });

    it('should invalidate an object with incorrect email format', () => {
      const invalidCandidateRegister = {
        email: 'invalid-email',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
      };

      const { error } = candidateRegisterSchema.validate(
        invalidCandidateRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Please provide a valid email address.'
      );
    });

    it('should invalidate an object with non-matching passwords', () => {
      const invalidCandidateRegister = {
        email: 'candidate@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'differentPassword',
      };

      const { error } = candidateRegisterSchema.validate(
        invalidCandidateRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Confirm password must match the new password.'
      );
    });

    it('should invalidate an object with invalid title', () => {
      const invalidCandidateRegister = {
        email: 'candidate@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: 'InvalidTitle' as any, // Invalid title
      };

      const { error } = candidateRegisterSchema.validate(
        invalidCandidateRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toMatch(
        /"title" must be one of \[Mr, Mrs, Ms, Miss, Dr, Prof, Rev, Capt, Sir, Madam, Mx, Rather Not Say\]/
      );
    });

    it('should validate optional fields when provided', () => {
      const validCandidateRegister = {
        email: 'candidate@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'Ms',
      };

      const { error } = candidateRegisterSchema.validate(
        validCandidateRegister
      );
      expect(error).toBeUndefined();
    });
  });
  // recruiter auth validator
  describe('recruiterRegisterSchema', () => {
    it('should validate a valid recruiter register object', () => {
      const validRecruiterRegister = {
        email: 'recruiter@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
        name: 'Recruiter Inc.',
        industry: 'Tech',
      };

      const { error } = recruiterRegisterSchema.validate(
        validRecruiterRegister
      );
      expect(error).toBeUndefined();
    });

    it('should invalidate an object with missing required fields', () => {
      const invalidRecruiterRegister = {
        email: 'recruiter@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        // confirmPassword is missing
      };

      const { error } = recruiterRegisterSchema.validate(
        invalidRecruiterRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe('Confirm password is required.');
    });

    it('should invalidate an object with incorrect email format', () => {
      const invalidRecruiterRegister = {
        email: 'invalid-email',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'password123',
      };

      const { error } = recruiterRegisterSchema.validate(
        invalidRecruiterRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Please provide a valid email address.'
      );
    });

    it('should invalidate an object with non-matching passwords', () => {
      const invalidRecruiterRegister = {
        email: 'recruiter@example.com',
        phoneNumber: '1234567890',
        newPassword: 'password123',
        confirmPassword: 'differentPassword',
      };

      const { error } = recruiterRegisterSchema.validate(
        invalidRecruiterRegister
      );
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toBe(
        'Confirm password must match the new password.'
      );
    });
  });
});
