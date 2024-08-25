/* eslint-disable @typescript-eslint/no-explicit-any */
import { Association, DataTypes, Model } from 'sequelize';
import { sequelize } from '../libs';
import { IAdmin } from '../interfaces';
import { User } from './user.model';

/**
 * Admin model class.
 * @class Admin
 * @extends {Model<IAdmin>}
 */
class Admin extends Model<IAdmin> implements IAdmin {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public userId!: number;

  public static associations: {
    user: Association<Admin, User>;
  };

  public static associate(models: any) {
    Admin.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

Admin.init(
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
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
  }
);

export { Admin };
