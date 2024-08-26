/**
 * @fileoverview
 * @module
 * @version
 */
import { validateAdmin } from './admin.validator';

describe('Admin Validator', () => {
  it('should pass validation for valid data', () => {
    const adminData = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeUndefined();
  });

  it('should fail validation for firstName with numbers', () => {
    const adminData = {
      firstName: 'John123',
      lastName: 'Doe',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'First name can only contain letters'
    );
  });

  it('should fail validation for lastName with symbols', () => {
    const adminData = {
      firstName: 'John',
      lastName: 'Doe@',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe(
      'Last name can only contain letters'
    );
  });

  it('should pass validation for empty optional fields', () => {
    const adminData = {};

    const { error, value } = validateAdmin(adminData);

    expect(error).toBeUndefined();
    expect(value).toEqual({});
  });

  it('should fail validation for empty firstName and lastName', () => {
    const adminData = {
      firstName: '',
      lastName: '',
    };

    const { error } = validateAdmin(adminData);

    expect(error).toBeDefined();
    expect(error?.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'First name cannot be empty' }),
        expect.objectContaining({ message: 'Last name cannot be empty' }),
      ])
    );
  });
});
