/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Application model definition
 * @version 1.0.0
 * @module applicationModel
 */

import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../libs';
import { Candidate } from './candidate.model';
import { Job } from './job.model';
import { IApplication } from '../interfaces';
import { ApplicationStatus } from '../types';

/**
 * Application model class.
 * @class Application
 * @extends {Model<IApplication>}
 */
class Application extends Model<IApplication> implements IApplication {
  /**
   * Application ID
   * @type {number}
   */
  public id!: number;

  /**
   * Associated job ID
   * @type {number}
   */
  public jobId!: number;

  /**
   * Associated candidate ID
   * @type {number}
   */
  public candidateId!: number;

  /**
   * Application status
   * @type {ApplicationStatus}
   */
  public status!: ApplicationStatus;

  public static associations: {
    job: Association<Application, Job>;
    candidate: Association<Application, Candidate>;
  };

  public static associate(models: any) {
    Application.belongsTo(models.Job, {
      foreignKey: 'jobId',
      as: 'job',
      onDelete: 'CASCADE',
    });
    Application.belongsTo(models.Candidate, {
      foreignKey: 'candidateId',
      as: 'candidate',
      onDelete: 'CASCADE',
    });
  }
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Job,
        key: 'id',
      },
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Candidate,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Shortlisted', 'Rejected'),
      allowNull: true,
      defaultValue: 'Pending',
    },
  },
  {
    sequelize,
    modelName: 'Application',
    timestamps: true,
  }
);

export { Application };
