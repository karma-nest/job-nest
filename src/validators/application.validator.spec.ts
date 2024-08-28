/**
 * @fileoverview
 * @module
 * @version
 */
import {
  validateCreateApplication,
  validateUpdateApplication,
} from './application.validator';
import { IApplicationsQuery } from '../interfaces';
import { ApplicationStatus } from '../types';

describe('validateCreateApplication', () => {
  it('should validate successfully with valid jobId and candidateId', () => {
    const validData: IApplicationsQuery = {
      jobId: 123,
      candidateId: 456,
    };

    const { error } = validateCreateApplication(validData);
    expect(error).toBeUndefined();
  });

  it('should return an error if jobId is missing', () => {
    const invalidData: Partial<IApplicationsQuery> = {
      candidateId: 456,
    };

    const { error } = validateCreateApplication(
      invalidData as IApplicationsQuery
    );
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('jobId is required');
  });

  it('should return an error if candidateId is missing', () => {
    const invalidData: Partial<IApplicationsQuery> = {
      jobId: 123,
    };

    const { error } = validateCreateApplication(
      invalidData as IApplicationsQuery
    );
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('candidateId is required');
  });

  it('should return an error if jobId is not a number', () => {
    const invalidData = {
      jobId: 'abc',
      candidateId: 456,
    };

    const { error } = validateCreateApplication(
      invalidData as unknown as IApplicationsQuery
    );
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('jobId must be a number');
  });

  it('should return an error if candidateId is not a number', () => {
    const invalidData = {
      jobId: 123,
      candidateId: 'xyz',
    };

    const { error } = validateCreateApplication(
      invalidData as unknown as IApplicationsQuery
    );
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('candidateId must be a number');
  });

  it('should return an error if jobId is not an integer', () => {
    const invalidData = {
      jobId: 123.45,
      candidateId: 456,
    };

    const { error } = validateCreateApplication(
      invalidData as IApplicationsQuery
    );
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('jobId must be an integer');
  });

  it('should return an error if candidateId is not an integer', () => {
    const invalidData = {
      jobId: 123,
      candidateId: 456.78,
    };

    const { error } = validateCreateApplication(
      invalidData as IApplicationsQuery
    );
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('candidateId must be an integer');
  });
});

// describe('validateUpdateApplication', () => {
//   it('should validate successfully with a valid status', () => {
//     const validStatus: ApplicationStatus = 'Approved';

//     const { error } = validateUpdateApplication(validStatus);
//     expect(error).toBeUndefined();
//   });

//   it('should return an error if status is missing', () => {
//     const invalidStatus = '';

//     const { error } = validateUpdateApplication(
//       invalidStatus as ApplicationStatus
//     );
//     expect(error).toBeDefined();
//     expect(error?.details[0].message).toBe('Status is required for update');
//   });

//   it('should return an error if status is invalid', () => {
//     const invalidStatus = 'InvalidStatus';

//     const { error } = validateUpdateApplication(
//       invalidStatus as ApplicationStatus
//     );
//     expect(error).toBeDefined();
//     expect(error?.details[0].message).toBe(
//       'Status must be one of [Pending, Approved, Shortlisted, Rejected]'
//     );
//   });
// });
