/**
 * @fileoverview Defines the structure of a JWT token.
 * @version 1.0.0
 * @module jwtTokenInterface
 */

/**
 * Interface representing a JWT token payload.
 */
export interface IJwtToken {
  id: number;
  role: string;
  type: string;
}
