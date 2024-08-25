/**
 * @fileoverview Utility class for handling JWT operations.
 * @version 1.0.0
 * @module JwtUtil
 */
import jwt from 'jsonwebtoken';
import { authConfig } from '../configs';
import { IJwtToken } from '../interfaces';

export default class JwtUtil {
  private getJwtKey = (role: string, tokenType: string): string => {
    const key = authConfig[role]['jwt'][tokenType];
    if (!key) {
      throw new Error(`JWT type ${tokenType} is not valid for role ${role}.`);
    }
    return key;
  };

  private getTokenExpiration = (jwtTokenType: string): number | undefined => {
    switch (jwtTokenType) {
      case 'accessToken':
        return 24 * 60 * 60; // 1 day
      case 'activationToken':
        return 10 * 60; // 10 minutes
      case 'passwordToken':
        return 5 * 60; // 5 minutes
      default:
        return undefined;
    }
  };

  public verifyJwt = (
    payload: {
      role: string;
      type: string;
      token: string;
    },
    callback: (error: Error | null, decoded?: IJwtToken) => void
  ): void => {
    const jwtKey = this.getJwtKey(payload?.role, payload?.type);
    jwt.verify(payload?.token, jwtKey, (error, decoded) => {
      if (error) {
        callback(error);
      } else {
        callback(null, decoded as IJwtToken);
      }
    });
  };

  public generateJwtToken = (
    payload: IJwtToken,
    callback: (error: Error | null, token?: string) => void
  ): void => {
    try {
      const jwtKey = this.getJwtKey(payload?.role, payload?.type);
      const expiresIn = this.getTokenExpiration(payload?.type);

      if (expiresIn === undefined) {
        throw new Error(`Invalid JWT token type: ${payload?.type}`);
      }

      jwt.sign(
        payload,
        jwtKey,
        { expiresIn },
        (error: Error, token: string) => {
          if (error) {
            callback(
              new Error(`Token generation failed: ${error?.message || error}`)
            );
          } else {
            callback(null, token);
          }
        }
      );
    } catch (error) {
      callback(
        new Error(`Token generation failed: ${error?.message || error}`)
      );
    }
  };

  public verifyJwtToken = (
    payload: {
      role: string;
      tokenType: string;
      jwtToken: string;
    },
    callback: (error: Error | null, decodedToken?: IJwtToken) => void
  ): void => {
    try {
      const jwtKey = this.getJwtKey(payload?.role, payload?.tokenType);
      jwt.verify(payload?.jwtToken, jwtKey, (error, decoded) => {
        if (error) {
          callback(error);
        } else {
          callback(null, decoded as IJwtToken);
        }
      });
    } catch (error) {
      callback(
        new Error(`Token verification failed: ${error?.message || error}`)
      );
    }
  };
}
