"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_NAME = exports.POSTGRES_HOST = exports.POSTGRES_PASSWORD = exports.POSTGRES_USER = exports.POSTGRES_NAME = exports.CRYPTO_SECRET_KEY = exports.SESSION_SECRET = exports.CLIENTURL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.CLIENTURL = process.env.CLIENTURL;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
exports.POSTGRES_NAME = process.env.POSTGRES_NAME;
exports.POSTGRES_USER = process.env.POSTGRES_USER;
exports.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
exports.POSTGRES_HOST = process.env.POSTGRES_HOST;
exports.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
