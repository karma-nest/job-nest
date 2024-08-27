import { validateRecruiter } from './recruiter.validator';
import { IRecruiter } from '../interfaces';

describe('validateRecruiter', () => {
  it('should validate a valid recruiter object', () => {
    const recruiter: Partial<IRecruiter> = {
      name: 'Tech Solutions',
      industry: 'Software Development',
      websiteUrl: 'https://techsolutions.com',
      location: 'New York, NY',
      description: 'A leading software development company.',
      size: 500,
      foundedIn: 2000,
      isVerified: true,
    };

    const { error, value } = validateRecruiter(recruiter);
    expect(error).toBeUndefined();
    expect(value).toEqual(recruiter);
  });

  it('should validate an empty recruiter object', () => {
    const recruiter: Partial<IRecruiter> = {};

    const { error, value } = validateRecruiter(recruiter);
    expect(error).toBeUndefined();
    expect(value).toEqual(recruiter);
  });

  it('should return error for invalid name', () => {
    const recruiter: Partial<IRecruiter> = {
      name: 123 as unknown as string, // Invalid type
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Name must be a string.');
  });

  it('should return error for name exceeding max length', () => {
    const recruiter: Partial<IRecruiter> = {
      name: 'A'.repeat(256), // Exceeds max length
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'Name must be less than or equal to 255 characters.'
    );
  });

  it('should return error for invalid website URL', () => {
    const recruiter: Partial<IRecruiter> = {
      websiteUrl: 'invalid-url', // Invalid URL
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Website URL must be a valid URI.');
  });

  it('should return error for size being less than 1', () => {
    const recruiter: Partial<IRecruiter> = {
      size: 0, // Invalid size
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Size must be at least 1.');
  });

  it('should return error for foundedIn being before 1800', () => {
    const recruiter: Partial<IRecruiter> = {
      foundedIn: 1700, // Invalid foundedIn year
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Founded in must be at least 1800.');
  });

  it('should return error for foundedIn being after the current year', () => {
    const recruiter: Partial<IRecruiter> = {
      foundedIn: new Date().getFullYear() + 1,
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      `Founded in must be less than or equal to the current year (${new Date().getFullYear()}).`
    );
  });

  it('should return error for invalid isVerified type', () => {
    const recruiter: Partial<IRecruiter> = {
      isVerified: 'yes' as unknown as boolean,
    };

    const { error } = validateRecruiter(recruiter);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('Is Verified must be a boolean.');
  });
});
