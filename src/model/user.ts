import { Sequelize, Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare profile: string;
  declare password: string;
  declare admin: boolean;
}

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  profile?: string;
  password?: string;
  admin?: boolean;
}

User.init(
  {
    id: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    profile: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    admin: {
      type: new DataTypes.BOOLEAN(),
      allowNull: true,
    },
  },
  {
    tableName: "user",
    sequelize,
  }
);

export default User;
