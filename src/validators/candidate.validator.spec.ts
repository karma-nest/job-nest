/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * @module
 * @version
 */
import { validateCandidate } from './candidate.validator';
import { ICandidate } from '../interfaces';

describe('validateCandidate', () => {
  it('should validate a valid candidate object', () => {
    const candidate: Partial<ICandidate> = {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Mr',
      skills: ['JavaScript', 'TypeScript'],
      isEmployed: true,
    };

    const { error, value } = validateCandidate(candidate);

    expect(error).toBeUndefined();
    expect(value).toEqual(candidate);
  });

  it('should allow optional fields to be omitted', () => {
    const candidate: Partial<ICandidate> = {};

    const { error, value } = validateCandidate(candidate);

    expect(error).toBeUndefined();
    expect(value).toEqual(candidate);
  });

  it('should return an error for an invalid first name', () => {
    const candidate: Partial<ICandidate> = {
      firstName: 'John123',
    };

    const { error } = validateCandidate(candidate);

    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toBe(
        'First name must only contain letters.'
      );
    }
  });

  it('should return an error for an invalid last name', () => {
    const candidate: Partial<ICandidate> = {
      lastName: 'Doe@!',
    };

    const { error } = validateCandidate(candidate);

    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toBe(
        'Last name must only contain letters.'
      );
    }
  });

  it('should return an error for an invalid title', () => {
    const candidate: Partial<ICandidate> = {
      title: 'InvalidTitle' as any,
    };

    const { error } = validateCandidate(candidate);

    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toBe(
        'Title must be one of [Mr, Mrs, Ms, Miss, Dr, Prof, Rev, Capt, Sir, Madam, Mx, Rather Not Say]'
      );
    }
  });

  it('should return an error if a skill exceeds 100 characters', () => {
    const candidate: Partial<ICandidate> = {
      skills: ['a'.repeat(101)],
    };

    const { error } = validateCandidate(candidate);

    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toBe(
        'Each skill must be at most 100 characters long.'
      );
    }
  });

  it('should return an error if skills is not an array', () => {
    const candidate: Partial<ICandidate> = {
      skills: 'NotAnArray' as any,
    };

    const { error } = validateCandidate(candidate);

    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toBe(
        'Skills must be an array of strings.'
      );
    }
  });

  it('should return an error if isEmployed is not a boolean', () => {
    const candidate: Partial<ICandidate> = {
      isEmployed: 'yes' as any,
    };

    const { error } = validateCandidate(candidate);

    expect(error).toBeDefined();
    if (error) {
      expect(error.details[0].message).toBe(
        'Employment status must be a boolean value.'
      );
    }
  });
});
