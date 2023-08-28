"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailExists = exports.verifyToken = void 0;
const firebase_1 = require("../config/firebase");
const firebase_2 = __importDefault(require("../config/firebase"));
const verifyToken = (token) => {
    return (0, firebase_1.auth)()
        .verifyIdToken(token)
        .then((decodeToken) => {
        return decodeToken;
    })
        .catch((error) => {
        console.log("Error: ", error);
        return null;
    });
};
exports.verifyToken = verifyToken;
const emailExists = (email) => {
    return firebase_2.default
        .auth()
        .getUserByEmail(email)
        .then(() => {
        return true;
    })
        .catch(() => {
        return false;
    });
};
exports.emailExists = emailExists;
