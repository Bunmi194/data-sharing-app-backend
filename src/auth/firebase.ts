import { auth } from "../config/firebase";
import admin from "../config/firebase";

export const verifyToken = (token: string) => {
  return auth()
    .verifyIdToken(token)
    .then((decodeToken) => {
      return decodeToken;
    })
    .catch((error) => {
      console.log("Error: ", error);
      return null;
    });
};

export const emailExists = (email: string) => {
  return admin
    .auth()
    .getUserByEmail(email)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
