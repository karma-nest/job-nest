/**
 * @fileoverview RateLimiter class implementing Singleton pattern
 * @module RateLimiter
 * @version 1.0.0
 */

import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

/**
 * Class representing the rate limiter configuration.
 */
class RateLimiter {
  private static instance: RateLimiter;

  /**
   * Private constructor to prevent direct instantiation.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * Gets the singleton instance of the RateLimiter class.
   * @returns {RateLimiter} The singleton instance.
   */
  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Rate limiter for the register endpoint.
   * Limits each IP to 5 requests per 15 minutes.
   * @returns {RateLimitRequestHandler}
   */
  public register: () => RateLimitRequestHandler = () => {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 5,
      standardHeaders: true,
      legacyHeaders: false,
    });
  };

  /**
   * Rate limiter for the login and logout endpoints.
   * Limits each IP to 10 requests per 10 minutes.
   * @returns {RateLimitRequestHandler}
   */
  public loginAndLogout: () => RateLimitRequestHandler = () => {
    return rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
    });
  };

  /**
   * Rate limiter for the forgot password and request activation endpoints.
   * Limits each IP to 5 requests per 15 minutes.
   * @returns {RateLimitRequestHandler}
   */
  public passwordResetAndActivation: () => RateLimitRequestHandler = () => {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 5,
      standardHeaders: true,
      legacyHeaders: false,
    });
  };
}

export const rateLimiter = RateLimiter.getInstance();
