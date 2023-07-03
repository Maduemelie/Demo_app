import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/user-route.js";
import postRouter from "./routes/post-route";
import adRouter from "./routes/ad-route";
import config from "config";
import error from "./middlewares/error.js";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({}));

mongoose
  .connect(config.get("db.uri"))
  .then(() =>
    console.log("Database Connection Established", config.get("db.uri"))
  )
  .catch((e) => console.log(e.message));

// PORT
const port = config.get("app.port");

app.use(express.json());

app.use("/api/v1", authRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", adRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err["status"] = 404;
  next(err);
});
app.use("*", (req, res, next) => {
  return next(new Error("not found"));
});

app.use(error);

// setting up port
app.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});
