/**
 * @fileoverview Configuration for database connections.
 * @version 1.0.0
 * @module databaseConfig
 */
import { IDatabaseConfig } from '../interfaces';

const {
  POSTGRES_DATABASE_NAME,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_UPSTASH_URL,
} = process.env;

/**
 * Multiple database configurations, one for development and one for production.
 * @type {DatabaseConfig}
 */
export const databaseConfig: IDatabaseConfig = {
  postgres: {
    databaseName: POSTGRES_DATABASE_NAME,
    username: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
  },
  redis: {
    development: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@127.0.0.1:6380/4`,
    production: REDIS_UPSTASH_URL as string,
  },
};
