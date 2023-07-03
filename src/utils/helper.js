import jwt from "jsonwebtoken";
import config from "config";

export const signToken = (obj) => {
  console.log("appScret:", `${config.get("app.appSecret")}`);
  return jwt.sign(obj, `${config.get("app.appSecret")}`, {
    expiresIn: config.get("api.expiresIn"),
  });
};

export function generateResetToken() {
  const tokenLength = 20;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
}
