import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

export const auth = getAuth;
const credentials = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export default admin;
