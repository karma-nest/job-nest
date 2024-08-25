import { isPassword } from './password.validator';

describe('isPassword', () => {
  test('should call callback with null and confirmPassword if password is valid', () => {
    const password = 'Valid123';
    const confirmPassword = 'Valid123';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toBeNull();
      expect(result).toBe(confirmPassword);
    };
    isPassword(password, confirmPassword, callback);
  });

  test('should call callback with error if passwords do not match', () => {
    const password = 'Valid123';
    const confirmPassword = 'Invalid123';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toEqual(new Error('The passwords entered do not match.'));
      expect(result).toBeNull();
    };
    isPassword(password, confirmPassword, callback);
  });

  test('should call callback with error if password does not contain lowercase letter', () => {
    const password = 'INVALID123';
    const confirmPassword = 'INVALID123';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toEqual(
        new Error('Password must contain at least one lowercase letter.')
      );
      expect(result).toBeNull();
    };
    isPassword(password, confirmPassword, callback);
  });

  test('should call callback with error if password does not contain uppercase letter', () => {
    const password = 'valid123';
    const confirmPassword = 'valid123';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toEqual(
        new Error('Password must contain at least one uppercase letter.')
      );
      expect(result).toBeNull();
    };
    isPassword(password, confirmPassword, callback);
  });

  test('should call callback with error if password does not contain a digit', () => {
    const password = 'InvalidPass';
    const confirmPassword = 'InvalidPass';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toEqual(
        new Error('Password must contain at least one digit.')
      );
      expect(result).toBeNull();
    };
    isPassword(password, confirmPassword, callback);
  });

  test('should call callback with error if password is too short', () => {
    const password = 'Short1';
    const confirmPassword = 'Short1';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toEqual(
        new Error('Password must be at least 8 characters long.')
      );
      expect(result).toBeNull();
    };
    isPassword(password, confirmPassword, callback);
  });

  test('should call callback with error if input types are invalid', () => {
    const invalidPassword = 123 as unknown as string;
    const validConfirmPassword = 'Valid123';

    const callback = (error: Error | null, result: string | null) => {
      expect(error).toEqual(new Error('Invalid input.'));
      expect(result).toBeNull();
    };

    isPassword(invalidPassword, validConfirmPassword, callback);
  });
});
