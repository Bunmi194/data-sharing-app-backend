import app from "./app";
import { PORT } from "./env";

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
