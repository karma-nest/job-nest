/**
 * @fileoverview
 * @version 1.0.0
 * @module dbInterfaces
 */

interface IPostgresConfig {
  databaseName: string;
  username: string;
  password: string;
  host: string;
}
interface IRedisConfig {
  development: string;
  production: string;
}

export interface IDatabaseConfig {
  postgres: IPostgresConfig;
  redis: IRedisConfig;
}
