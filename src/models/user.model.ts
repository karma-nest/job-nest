/* eslint-disable @typescript-eslint/no-explicit-any */
import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../libs';
import { IUser } from '../interfaces';
import { Admin } from './admin.model';
import { Candidate } from './candidate.model';
import { Recruiter } from './recruiter.model';

/**
 * User model class.
 * @class User
 * @extends {Model<IUser>}
 */
class User extends Model<IUser> implements IUser {
  public id!: number;
  public avatarUrl?: string;
  public email!: string;
  public mobileNumber!: string;
  public password!: string;
  public role!: 'admin' | 'candidate' | 'recruiter';
  public isVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // User mode
  public static associations: {
    admin: Association<User, Admin>;
    candidate: Association<User, Candidate>;
    recruiter: Association<User, Recruiter>;
  };

  public static associate(models: any) {
    User.hasOne(models.Admin, {
      foreignKey: 'userId',
      as: 'admin',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Candidate, {
      foreignKey: 'userId',
      as: 'candidate',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Recruiter, {
      foreignKey: 'userId',
      as: 'recruiter',
      onDelete: 'CASCADE',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'candidate', 'recruiter'),
      allowNull: false,
      defaultValue: 'candidate',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export { User };
