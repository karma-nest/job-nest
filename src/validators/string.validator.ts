/**
 * @fileoverview This module provides functions for validating strings.
 * @version 1.0.0
 * @module stringValidator
 */
import crypto from 'crypto';

/**
 * Compares two strings to see if they are equal, ignoring leading and trailing spaces.
 *
 * @param {string} str1 The first string to compare.
 * @param {string} str2 The second string to compare.
 * @returns {boolean} `true` if the two strings are equal, `false` otherwise.
 */
export const compareStrings = (str1: string, str2: string): boolean => {
  const trimmedStr1 = str1.trim();
  const trimmedStr2 = str2.trim();

  const buffer1: Buffer = Buffer.from(trimmedStr1, 'utf8');
  const buffer2: Buffer = Buffer.from(trimmedStr2, 'utf8');

  return (
    buffer1.length === buffer2.length &&
    crypto.timingSafeEqual(buffer1, buffer2)
  );
};
