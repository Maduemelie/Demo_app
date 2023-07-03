import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user.model";
import { UNAUTHORIZED } from "../utils/constant";

export default (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];
  // decode token
  if (token) {
    jwt.verify(
      token.substring(7),
      `${config.get("app.appSecret")}`,
      async (err, decoded) => {
        if (err) {
          let message = "";
          if (err.name) {
            switch (err.name) {
              case "TokenExpiredError":
                message = "You are not logged in!";
                break;
              default:
                message = "Failed to authenticate token";
                break;
            }
          }
          return res.status(UNAUTHORIZED).json({
            status: false,
            message,
          });
        } else {
          if (decoded) {
            req.authId = decoded["id"];
            const user = await User.findById(decoded["id"]);
            if (!user) {
              return res.status(UNAUTHORIZED).json({
                status: false,
                message: '',
              });
            }
            req.auth = await User.findById(decoded["id"]);
          }
          req.headers["x-auth-token"] = token;
          req.headers["authorization"] = `Bearer ${token}`;
          req.headers["Authorization"] = `Bearer ${token}`;
          next();
        }
      }
    );
  } else {
    return res.status(UNAUTHORIZED).json({
      status: false,
      message: "No authorization token provided",
    });
  }
};
