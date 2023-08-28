import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./route/user";
import companyRoutes from "./route/company";
import { CLIENTURL, SESSION_SECRET } from "./env";
import session from "express-session";
import { sequelize } from "./config/database";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: `${CLIENTURL}`, //change this after deployment
  })
);

app.use(
  session({
    secret: `${SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  })
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connection established`);
  } catch (error) {
    console.log("Error: ", error);
  }
};
connectDatabase();
app.use(cookieParser());
app.use(morgan("tiny"));
app.use("/v1/user", userRoutes);
app.use("/v1/data", companyRoutes);

export default app;
