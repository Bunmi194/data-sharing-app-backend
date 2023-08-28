"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_1 = __importDefault(require("./user"));
class Company extends sequelize_1.Model {
}
Company.init({
    userId: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    companyName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    numberOfUsers: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
    },
    numberOfProducts: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
    },
    percentage: {
        type: new sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
    },
}, {
    tableName: "companies",
    sequelize: database_1.sequelize,
});
Company.belongsTo(user_1.default, {
    foreignKey: "userId",
    foreignKeyConstraint: true,
});
exports.default = Company;
