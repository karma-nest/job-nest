/**
 * @fileoverview
 * @version
 * @module
 */

/**
 * Interface for error source details.
 */
interface IErrorSource {
  module: string;
  method: string;
  trace: Record<string, unknown>;
}

/**
 * Interface for error details.
 */
interface IErrorDetails {
  message: string;
  source: IErrorSource;
}

export { IErrorSource, IErrorDetails };
