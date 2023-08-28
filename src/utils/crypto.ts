import * as CryptoJS from "crypto-js";
import { CRYPTO_SECRET_KEY } from "../env";

const secretKey = CRYPTO_SECRET_KEY;

export const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, `${secretKey}`).toString();
}

export const decryptData = (data: string) => {
    return CryptoJS.AES.decrypt(data, `${secretKey}`).toString(CryptoJS.enc.Utf8);
}