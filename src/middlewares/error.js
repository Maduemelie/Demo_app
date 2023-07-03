import config from "config";
import MongooseError from "mongoose/lib/error";
import { BAD_REQUEST, CONFLICT } from "../utils/constant";

export default (error, req, res, next) => {
  const meta = {};
  if (error instanceof MongooseError) {
    const code = 503;
    meta["statusCode"] = code;
    meta["error"] = {
      code,
      message: "Some setup problems with datastore, please try again",
    };
    meta["developerMessage"] = error;
  } else if (error.name === "MongoError") {
    meta["statusCode"] = CONFLICT;
    meta["error"] = { CONFLICT: "", message: "Duplicate record found" };
    meta["developerMessage"] = error;
  } else if (error instanceof Error) {
    meta["statusCode"] = error["status"] || 500;
    meta["error"] = { code: error["status"], message: error.message };
    meta["developerMessage"] = error;
  } else if (error.name === "ValidationError") {
    meta["statusCode"] = BAD_REQUEST;
    meta["error"] = {
      code: BAD_REQUEST,
      message: "Validation Error",
    };
  } else {
    let code = 500;
    meta["statusCode"] = code;
    meta["error"] = {
      code: code,
      message: "A problem with our server, please try again later",
    };
    meta["developerMessage"] = error;
  }
  if (`${config.util.getEnv("NODE_ENV")}` !== "production") {
    console.log("error >>>>>>>>>>>>>>> ", error);
  }
  return res.status(meta["statusCode"]).json(meta);
};
