/**
 * @fileoverview
 * @version 1.0.0
 * @module passwordValidatorSpec
 */
import { compareStrings } from './string.validator';

describe('compareStrings', () => {
  it('should return true for equal strings', () => {
    const str1 = 'Hello, World!';
    const str2 = 'Hello, World!';

    const result = compareStrings(str1, str2);

    expect(result).toBe(true);
  });

  it('should return false for different strings', () => {
    const str1 = 'Hello, World!';
    const str2 = 'Hello, Universe!';

    const result = compareStrings(str1, str2);

    expect(result).toBe(false);
  });

  it('should handle strings with leading/trailing spaces', () => {
    const str1 = '  Hello, World!  ';
    const str2 = 'Hello, World!';

    const result = compareStrings(str1, str2);

    expect(result).toBe(true);
  });

  it('should handle empty strings', () => {
    const str1 = '';
    const str2 = '';

    const result = compareStrings(str1, str2);

    expect(result).toBe(true);
  });

  it('should handle strings with different casing', () => {
    const str1 = 'Hello, World!';
    const str2 = 'hello, world!';

    const result = compareStrings(str1, str2);

    expect(result).toBe(false);
  });
});
