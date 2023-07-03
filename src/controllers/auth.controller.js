import User from "../models/user.model.js";
import axios from "axios";
import {
  createUserValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import bcrypt from "bcrypt";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
} from "../utils/constant.js";
import { signToken } from "../utils/helper.js";

import { sendResetPasswordEmail } from "../utils/email.js";
import { generateResetToken } from "../utils/helper.js";

export default class AuthController {
  static async createAccountWithFB(req, res, next) {
    try {
      const { accessToken } = req.body;
      const response = await axios.get(
        `https://graph.facebook.com/v15.0/me?fields=id,name,first_name,last_name&access_token=${accessToken}`
      );
      console.log(response.data);
      const { id, name, first_name, last_name } = response.data;
      const newUser = new User({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        name: response.data.name,
      });
      await newUser.save();
      return res.json({
        status: true,
        message: "User created successfully",
        data: {
          id,
          name,
          first_name,
          last_name,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createAccountWithGoogle(req, res, next) {
    try {
      const { accessToken } = req.body;
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`
      );
      console.log(response.data);
      const { id } = response.data;
      console.log(`User ID: ${id}`);
      return res.json({ id });
    } catch (error) {
      return next(error);
    }
  }

  static async createAccount(req, res, next) {
    try {
      const { error } = createUserValidator.validate(req.body);
      if (error) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: "There's a missing field in your input",
          error,
        });
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: "User with this username already exists",
        });
      }
      user = new User(req.body);
      user = await user.save();
      const token = signToken({ id: user._id, username: user.username });
      return res.status(CREATED).json({
        status: true,
        message: "User created successfully",
        token,
        data: user,
      });
    } catch (e) {
      return next(e);
    }
  }
  static async login(req, res, next) {
    try {
      const { error } = loginValidator.validate(req.body);
      if (error) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: "There's a missing field in your input",
          error,
        });
      }
      const user = await User.findOne({ username: req.body.username }).select(
        "+password"
      );
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
      const password = bcrypt.compareSync(req.body.password, user.password);
      user.password = undefined;
      if (!password) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: "Invalid Username or Password",
        });
      }
      const token = signToken({ id: user._id, username: user.username });
      return res.status(CREATED).json({
        status: true,
        message: "Logged in successfully",
        token,
        data: user,
      });
    } catch (e) {
      return next(e);
    }
  }

  static async sendPasswordResetEmail(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetToken = generateResetToken();
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();

      sendResetPasswordEmail(user.email, resetToken);

      return res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
}
