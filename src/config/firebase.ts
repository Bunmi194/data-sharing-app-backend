import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import path from "path";

export const auth = getAuth;
const serviceAccountDirectory = path.join(__dirname, "./service-account.json");
const credentials = require(serviceAccountDirectory);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export default admin;
