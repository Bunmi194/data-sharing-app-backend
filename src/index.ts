import app from "./app";
import { PORT } from "./env";
import {
  POSTGRES_NAME,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
} from "./env";

console.log(POSTGRES_NAME, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST)
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
