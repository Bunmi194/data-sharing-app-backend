"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("../env");
exports.sequelize = new sequelize_1.Sequelize(`${env_1.POSTGRES_NAME}`, `${env_1.POSTGRES_USER}`, `${env_1.POSTGRES_PASSWORD}`, {
    host: `${env_1.POSTGRES_HOST}`,
    dialect: "postgres",
});
