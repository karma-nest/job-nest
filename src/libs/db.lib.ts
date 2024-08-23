/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Database connection library.
 * @version 1.0.0
 * @module database
 */
import { Redis } from 'ioredis';
import { Sequelize, Dialect } from 'sequelize';
import { databaseConfig } from '../configs';

class DatabaseLib {
  private static instance: DatabaseLib;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public sequelizeConnect = (): Sequelize => {
    return new Sequelize(
      databaseConfig?.postgres?.databaseName,
      databaseConfig?.postgres?.username,
      databaseConfig?.postgres?.password,
      {
        host: databaseConfig?.postgres?.host,
        dialect: 'postgres' as Dialect,
        protocol: 'postgres',
        pool: {
          max: 5,
          acquire: 30000,
          idle: 10000,
        },
        logging: (...debug: any[]) => {
          console.debug('Sequelize', debug);
        },
      }
    );
  };

  /**
   * Get the singleton instance of DatabaseLib.
   * @returns {DatabaseLib} The singleton instance.
   * @public
   */
  public static getInstance(): DatabaseLib {
    if (!DatabaseLib.instance) {
      DatabaseLib.instance = new DatabaseLib();
    }
    return DatabaseLib.instance;
  }

  /**
   * Connect to Redis.
   * @returns {Redis} The Redis client.
   * @public
   */
  public redisClient(): Redis {
    return new Redis();
  }
}

const dbInstance = DatabaseLib.getInstance();
const sequelize: Sequelize = dbInstance.sequelizeConnect();
const redis: Redis = dbInstance.redisClient();

export { sequelize, redis };
