"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    profile: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    admin: {
        type: new sequelize_1.DataTypes.BOOLEAN(),
        allowNull: true,
    },
}, {
    tableName: "users",
    sequelize: database_1.sequelize,
});
exports.default = User;
