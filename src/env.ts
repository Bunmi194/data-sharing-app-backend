import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const CLIENTURL = process.env.CLIENTURL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;
export const POSTGRES_NAME = process.env.POSTGRES_NAME;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID;
export const CLIENT_ID = process.env.CLIENT_ID;
