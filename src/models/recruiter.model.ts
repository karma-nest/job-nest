/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Recruiter Model Definition
 * @version 1.0.0
 * @module recruiterModel
 */
import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from '../libs';
import { User } from './user.model';
import { IRecruiter } from '../interfaces';

/**
 * Recruiter model class.
 * @class Recruiter
 * @extends {Model<IRecruiter>}
 */
class Recruiter extends Model<IRecruiter> implements IRecruiter {
  /**
   * Recruiter ID
   * @type {number}
   */
  public id!: number;

  /**
   * Recruiter Name
   * @type {string}
   */
  public name!: string;

  /**
   * Industry of the Recruiter
   * @type {string}
   */
  public industry!: string;

  /**
   * Website URL of the Recruiter
   * @type {string | undefined}
   */
  public websiteUrl?: string;

  /**
   * Location of the Recruiter
   * @type {string | undefined}
   */
  public location?: string;

  /**
   * Description of the Recruiter
   * @type {string | undefined}
   */
  public description?: string;

  /**
   * Size of the Recruiter organization
   * @type {number | undefined}
   */
  public size?: number;

  /**
   * Year the Recruiter was founded
   * @type {number | undefined}
   */
  public foundedIn?: number;

  /**
   * Verification status of the Recruiter
   * @type {boolean | undefined}
   */
  public isVerified?: boolean;

  /**
   * User ID associated with the Recruiter
   * @type {number}
   */
  public userId!: number;

  /**
   * Timestamps for the Recruiter model
   * @readonly
   * @type {Date}
   */
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Associations for the Recruiter model
   * @static
   * @type {object}
   */
  public static associations: {
    user: Association<Recruiter, User>;
  };

  public static associate(models: any) {
    Recruiter.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

Recruiter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    foundedIn: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Recruiter',
    timestamps: true,
  }
);

export { Recruiter };
