import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { PRIVATE_KEY, PRIVATE_KEY_ID, CLIENT_ID, CLIENT_EMAIL } from "../env";

export const auth = getAuth;

export const credentials2:any = {
  "type": "service_account",
  "project_id": "data-sharing-app-c44ef",
  "private_key_id": `${PRIVATE_KEY_ID}`,
  "private_key": `${PRIVATE_KEY}`.replace(/\\n/g, '\n'),
  "client_email": `${CLIENT_EMAIL}`,
  "client_id": `${CLIENT_ID}`,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7azvo%40data-sharing-app-c44ef.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

export const credentials = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials2),
});

export default admin;
