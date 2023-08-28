import { Sequelize, Model, DataTypes } from "sequelize";
import {
  POSTGRES_NAME,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
} from "../env";

export const sequelize = new Sequelize(
  `${POSTGRES_NAME}`,
  `${POSTGRES_USER}`,
  `${POSTGRES_PASSWORD}`,
  {
    host: `${POSTGRES_HOST}`,
    dialect: "postgres",
  }
);
