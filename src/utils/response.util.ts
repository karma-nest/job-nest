/**
 * @fileoverview Utility class for handling HTTP responses.
 * @version 1.0.0
 * @module responseUtil
 */
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { logger } from '.';

/**
 * Utility class for formatting and sending HTTP responses.
 */
export default class ResponseUtil {
  private readonly serviceName: string;
  private readonly _unprocessableErrorMsg = 'Sorry, no payload data.';
  public moduleName: string;

  /**
   * Creates an instance of ResponseUtil.
   * @param {string} serviceName - The name of the service using this utility.
   */
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Formats the response object.
   * @param {StatusCodes} code - The HTTP status code.
   * @param {unknown} payload - The payload to include in the response.
   * @returns {{ code: StatusCodes, payload: unknown }} - The formatted response object.
   */
  private formatResponse = (
    code: StatusCodes,
    payload: unknown
  ): { code: StatusCodes; payload: unknown } => ({
    code,
    payload,
  });

  /**
   * Sends a 422 Unprocessable Entity response.
   * @param {Response} res - The Express response object.
   * @param {string} [errorMessage] - The error message to include in the response.
   */
  public unprocessableEntity = (res: Response, errorMessage?: string): void => {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json(
        this.formatResponse(
          StatusCodes.UNPROCESSABLE_ENTITY,
          errorMessage ?? this._unprocessableErrorMsg
        )
      );
  };

  /**
   * Handles errors and sends an appropriate response.
   * @param {Response} res - The Express response object.
   * @param {any} error - The error object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleError = (res: Response, error: any): void => {
    const statusCode = error?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    const logMethod = statusCode > 499 ? 'error' : 'warn';

    logger[this.serviceName][logMethod](error);

    this.error(
      res,
      statusCode,
      error.message ?? 'An unexpected error occurred.'
    );
  };

  /**
   * Sends a response with a specific status code and payload.
   * @param {Response} res - The Express response object.
   * @param {StatusCodes} code - The HTTP status code.
   * @param {unknown} payload - The payload to include in the response.
   */
  public response = (
    res: Response,
    code: StatusCodes,
    payload: unknown
  ): void => {
    res.status(code).json(this.formatResponse(code, payload));
  };

  /**
   * Sends an error response.
   * @param {Response} res - The Express response object.
   * @param {StatusCodes} code - The HTTP status code.
   * @param {string} message - The error message.
   */
  public error = (res: Response, code: StatusCodes, message: string): void => {
    res.status(code).json({
      code,
      payload: {
        error: {
          message,
          type: this.moduleName,
        },
      },
    });
  };
}
