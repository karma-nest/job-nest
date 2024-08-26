/**
 * @fileoverview
 * @module
 * @version
 */
import { validateContactUpdate } from './contact.validator';
import { IUpdateContactQuery } from '../interfaces';

describe('validateContactUpdate', () => {
  it('should pass validation for a valid email', () => {
    const validQuery: IUpdateContactQuery = { email: 'test@example.com' };
    const { error } = validateContactUpdate(validQuery);
    expect(error).toBeUndefined();
  });

  it('should pass validation for a valid phone number', () => {
    const validQuery: IUpdateContactQuery = { phoneNumber: '1234567890' };
    const { error } = validateContactUpdate(validQuery);
    expect(error).toBeUndefined();
  });

  it('should pass validation for both valid email and phone number', () => {
    const validQuery: IUpdateContactQuery = {
      email: 'test@example.com',
      phoneNumber: '1234567890',
    };
    const { error } = validateContactUpdate(validQuery);
    expect(error).toBeUndefined();
  });

  it('should pass validation with neither email nor phone number provided', () => {
    const validQuery: IUpdateContactQuery = {};
    const { error } = validateContactUpdate(validQuery);
    expect(error).toBeUndefined();
  });

  it('should fail validation for an invalid email', () => {
    const invalidQuery: IUpdateContactQuery = { email: 'invalid-email' };
    const { error } = validateContactUpdate(invalidQuery);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'Please provide a valid email address.'
    );
  });

  it('should fail validation for a non-numeric phone number', () => {
    const invalidQuery: IUpdateContactQuery = { phoneNumber: 'abc123' };
    const { error } = validateContactUpdate(invalidQuery);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'Phone Number can only contain numbers.'
    );
  });

  it('should fail validation for an empty email string', () => {
    const invalidQuery: IUpdateContactQuery = { email: '' };
    const { error } = validateContactUpdate(invalidQuery);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Email cannot be empty.');
  });

  it('should fail validation for an empty phone number string', () => {
    const invalidQuery: IUpdateContactQuery = { phoneNumber: '' };
    const { error } = validateContactUpdate(invalidQuery);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Phone Number cannot be empty.');
  });
});
