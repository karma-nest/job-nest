/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Candidate Model Definition
 * @version 1.0.0
 * @module candidateModel
 */
import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../libs';
import { ICandidate } from '../interfaces';
import { User } from './user.model';

/**
 * Candidate model class.
 * @class Candidate
 * @extends {Model<ICandidate>}
 */
class Candidate extends Model<ICandidate> implements ICandidate {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public title?: string;
  public skills?: string[];
  public isEmployed?: boolean;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<Candidate, User>;
  };

  public static associate(models: any) {
    Candidate.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

Candidate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.ENUM(
        'Mr',
        'Mrs',
        'Ms',
        'Miss',
        'Dr',
        'Prof',
        'Rev',
        'Capt',
        'Sir',
        'Madam',
        'Mx',
        'Rather Not Say'
      ),
      allowNull: true,
      defaultValue: 'Rather Not Say',
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    isEmployed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Candidate',
    tableName: 'Candidates',
    timestamps: true,
  }
);

export { Candidate };
