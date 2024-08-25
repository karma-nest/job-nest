/**
 * @fileoverview
 * @version
 * @module
 */
import { StatusCodes } from 'http-status-codes';
import { IErrorSource, IErrorDetails } from '../interfaces';

/**
 * Base class for custom API errors.
 */
export class CustomAPIError extends Error {
  statusCode: number;
  error: IErrorDetails;

  constructor(statusCode: number, error: IErrorDetails) {
    super(error.message);
    this.statusCode = statusCode;
    this.error = {
      message: error.message,
      source: {
        ...error.source,
        trace: {
          ...error.source.trace,
          line: new Error().stack?.split('\n')[1]?.trim() ?? '',
        },
      },
    };
  }
}

/**
 * Represents a Bad Request error (HTTP 400).
 */
export class BadRequestError extends CustomAPIError {
  constructor(error: IErrorDetails) {
    super(StatusCodes.BAD_REQUEST, error);
  }
}

/**
 * Represents an Unauthorized error (HTTP 401).
 */
export class UnauthorizedError extends CustomAPIError {
  data?: Record<string, unknown>;

  constructor(error: IErrorDetails & { data?: Record<string, unknown> }) {
    super(StatusCodes.UNAUTHORIZED, error);
    this.data = error.data;
  }
}

/**
 * Represents a Validation error (HTTP 422).
 */
export class ValidationError extends CustomAPIError {
  constructor(error: IErrorDetails) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, error);
  }
}

/**
 * Represents a Too Many Requests error (HTTP 429).
 */
export class TooManyRequestsError extends CustomAPIError {
  constructor(error: IErrorDetails) {
    super(StatusCodes.TOO_MANY_REQUESTS, error);
  }
}

/**
 * Represents a Request Failed error (HTTP 402).
 */
export class RequestFailedError extends CustomAPIError {
  constructor(error: IErrorDetails) {
    super(StatusCodes.PAYMENT_REQUIRED, error);
  }
}

/**
 * Represents a Not Found error (HTTP 404).
 */
export class NotFoundError extends CustomAPIError {
  constructor(error: IErrorDetails) {
    super(StatusCodes.NOT_FOUND, error);
  }
}

/**
 * Represents an Internal Server error (HTTP 500).
 */
export class InternalServerError extends CustomAPIError {
  constructor(error: IErrorDetails) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
}

/**
 * Utility class for creating errors.
 */
export default class CreateErrorUtil {
  /**
   * Creates a BadRequestError.
   * @param {string} message - The error message.
   * @param {IErrorSource} source - The source details of the error.
   * @returns {BadRequestError} - The created BadRequestError instance.
   */
  public createBadRequestError = (
    message: string,
    source: IErrorSource
  ): BadRequestError =>
    new BadRequestError({
      message,
      source,
    });

  /**
   * Creates an UnauthorizedError.
   * @param {string} message - The error message.
   * @param {IErrorSource} source - The source details of the error.
   * @param {Record<string, unknown>} [data] - Optional additional data related to the error.
   * @returns {UnauthorizedError} - The created UnauthorizedError instance.
   */
  public createUnauthorizedError = (
    message: string,
    source: IErrorSource,
    data?: Record<string, unknown>
  ): UnauthorizedError =>
    new UnauthorizedError({
      message,
      source,
      data,
    });

  /**
   * Creates a ValidationError.
   * @param {string} message - The error message.
   * @param {IErrorSource} source - The source details of the error.
   * @returns {ValidationError} - The created ValidationError instance.
   */
  public createValidationError = (
    message: string,
    source: IErrorSource
  ): ValidationError =>
    new ValidationError({
      message,
      source,
    });

  /**
   * Creates a TooManyRequestsError.
   * @param {string} message - The error message.
   * @param {IErrorSource} source - The source details of the error.
   * @returns {TooManyRequestsError} - The created TooManyRequestsError instance.
   */
  public createTooManyRequestsError = (
    message: string,
    source: IErrorSource
  ): TooManyRequestsError =>
    new TooManyRequestsError({
      message,
      source,
    });

  /**
   * Creates a RequestFailedError.
   * @param {string} message - The error message.
   * @param {IErrorSource} source - The source details of the error.
   * @returns {RequestFailedError} - The created RequestFailedError instance.
   */
  public createRequestFailedError = (
    message: string,
    source: IErrorSource
  ): RequestFailedError =>
    new RequestFailedError({
      message,
      source,
    });

  /**
   * Creates a NotFoundError.
   * @param {string} message - The error message.
   * @param {IErrorSource} source - The source details of the error.
   * @returns {NotFoundError} - The created NotFoundError instance.
   */
  public createNotFoundError = (
    message: string,
    source: IErrorSource
  ): NotFoundError =>
    new NotFoundError({
      message,
      source,
    });

  /**
   * Creates an InternalServerError.
   * @param {string} message - The error message.
   * @param {ErrorSource} source - The source details of the error.
   * @returns {InternalServerError} - The created InternalServerError instance.
   */
  public createInternalServerError = (
    message: string,
    source: IErrorSource
  ): InternalServerError => {
    return new InternalServerError({
      message,
      source,
    });
  };
}
