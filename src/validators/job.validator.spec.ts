/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * @module
 * @version
 */
import { IJob } from '../interfaces';
import { jobValidator } from './job.validator';

describe('jobValidator', () => {
  describe('create', () => {
    it('should validate a correct job object successfully', () => {
      const jobData: Partial<IJob> = {
        title: 'Software Engineer',
        description: 'Develop and maintain software applications.',
        responsibility: 'Write clean, maintainable code.',
        requirements: ['5+ years of experience', 'Proficient in TypeScript'],
        benefits: ['Health insurance', 'Paid time off'],
        location: 'Remote',
        type: 'Full-time',
        vacancy: 2,
        deadline: new Date(),
        tags: ['JavaScript', 'TypeScript'],
      };

      const { error, value } = jobValidator.create(jobData);

      expect(error).toBeUndefined();
      expect(value).toEqual(jobData);
    });

    // it('should return an error if required fields are missing', () => {
    //   const jobData: Partial<IJob> = {
    //     description: 'Develop and maintain software applications.',
    //     responsibility: 'Write clean, maintainable code.',
    //     requirements: ['5+ years of experience', 'Proficient in TypeScript'],
    //     location: 'Remote',
    //     type: 'Full-time',
    //   };

    //   const { error } = jobValidator.create(jobData);

    //   expect(error).toBeDefined();
    //   expect(error?.details).toEqual(
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         message: 'Title is a required field.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Benefits are required.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Vacancy should be a type of number.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Deadline is a required field.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Tags are required.',
    //       }),
    //     ])
    //   );
    // });

    // it('should return an error for invalid field types', () => {
    //   const jobData: Partial<IJob> = {
    //     title: 12345 as any,
    //     description: 'Develop and maintain software applications.',
    //     responsibility: 'Write clean, maintainable code.',
    //     requirements: ['5+ years of experience', 'Proficient in TypeScript'],
    //     benefits: ['Health insurance', 'Paid time off'],
    //     location: 'Remote',
    //     type: 'Full-time',
    //     vacancy: 'two' as any,
    //     deadline: 'Not a date' as any,
    //     tags: ['JavaScript', 123] as any,
    //   };

    //   const { error } = jobValidator.create(jobData);

    //   expect(error).toBeDefined();
    //   expect(error?.details).toEqual(
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         message: 'Title should be a type of text.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Vacancy should be a type of number.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Deadline should be a valid date.',
    //       }),
    //       expect.objectContaining({
    //         message: 'Each tag must be a valid string.',
    //       }),
    //     ])
    //   );
    // });
  });

  describe('jobValidator.update', () => {
    it('should validate a valid job object successfully', () => {
      const validJob: Partial<IJob> = {
        title: 'Software Engineer',
        description: 'Develop and maintain software.',
        responsibility: 'Write clean code.',
        requirements: ['Experience with TypeScript', 'Familiarity with React'],
        benefits: ['Health insurance', 'Remote work'],
        location: 'San Francisco',
        type: 'Full-time',
        vacancy: 5,
        deadline: new Date('2024-12-31'),
        tags: ['Tech', 'Software'],
        views: 100,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      };

      const { error, value } = jobValidator.update(validJob);

      expect(error).toBeUndefined();
      expect(value).toEqual(validJob);
    });

    it('should validate successfully with optional fields omitted', () => {
      const partialJob: Partial<IJob> = {
        title: 'Product Manager',
        location: 'New York',
      };

      const { error, value } = jobValidator.update(partialJob);

      expect(error).toBeUndefined();
      expect(value).toEqual(partialJob);
    });
  });
});
