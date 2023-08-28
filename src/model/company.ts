import { Sequelize, Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

class Company extends Model {
  declare companyName: string;
  declare numberOfUsers: number;
  declare numberOfProducts: number;
  declare percentage: number;
  declare userId: string;
}

Company.init(
  {
    userId: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    companyName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },

    numberOfUsers: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    numberOfProducts: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    percentage: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
  },
  {
    tableName: "companies",
    sequelize,
  }
);

Company.belongsTo(User, {
  foreignKey: "userId",
  foreignKeyConstraint: true,
});

export default Company;
