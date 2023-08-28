import app from "./app";
import { PORT } from "./env";
import {
  POSTGRES_NAME,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
} from "./env";
import { credentials, credentials2 } from "./config/firebase";
console.log("credentials: ", credentials);
console.log("credentials TYPE: ", typeof credentials);
console.log("credentials2: ", credentials2);
console.log("credentials2 TYPE: ", typeof credentials2);
console.log(POSTGRES_NAME, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST)
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
