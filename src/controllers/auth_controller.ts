import { Request, Response, NextFunction } from "express";
import User from "../models/users_model";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
type payload = {
  _id: string;
};
const register = async (req: Request, res: Response) => {
  try {
    const user_info = req.body;
    // Check if all required fields are provided
    const requiredFields = ["username", "password", "email", "fname", "lname"];
    for (const field of requiredFields) {
      if (!user_info[field] || user_info[field] === "") {
        throw new Error("All fields are required");
      }
    }

    // check if user already exists
    const existingUser = await User.findOne({ username: user_info.username });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // check if email already exists
    const existingEmail = await User.findOne({ email: user_info.email });
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Create a new user
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(user_info.password, salt);
    user_info.password = hashedPassword;
    const newUser = await User.create(user_info);
    res.status(200).send({ status: "Success", data: newUser });
    return;
  } catch (error) {
    res.status(400).send({ status: "Error", message: error.message });
    return;
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const user_info = req.body;
    // Check if all required fields are provided
    const requiredFields = ["username", "password"];
    for (const field of requiredFields) {
      if (!user_info[field] || user_info[field] === "") {
        throw new Error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    }

    // check if user exists
    const existingUser = await User.findOne({ username: user_info.username });
    if (!existingUser) {
      throw new Error("Username or password is incorrect");
    }

    // check if password is correct
    const validPassword = await bycrypt.compare(
      user_info.password,
      existingUser.password
    );
    if (!validPassword) {
      throw new Error("User or password is incorrect");
    }

    // check if auth configuration is set
    if (!process.env.TOKEN_SECRET) {
      throw new Error("Missing auth configuration");
    }

    // Create an access token
    const rand1 = Math.floor(Math.random() * 1000000);
    const accessToken = jwt.sign(
      { _id: existingUser._id, random: rand1 },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    // Create a refresh token
    const rand2 = Math.floor(Math.random() * 1000000);
    const refreshToken = jwt.sign(
      { _id: existingUser._id, random: rand2 },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    // save refresh token to db
    if (!existingUser.refreshTokens) existingUser.refreshTokens = [];
    existingUser.refreshTokens.push(refreshToken);
    await existingUser.save();

    res.status(200).send({
      status: "Success",
      data: {
        _id: existingUser._id,
        username: existingUser.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
    return;
  } catch (error) {
    res.status(400).send({ status: "Error", message: error.message });
    return;
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    res.status(401).send({ status: "Error", message: "401" });
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res
      .status(500)
      .send({ status: "Error", message: "Missing auth configuration" });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload: payload) => {
    if (err || !payload) {
      res.status(405).send({ status: "Error", message: err.message });
      return;
    }
    try {
      const existingUser = await User.findById(payload._id);
      if (!existingUser) {
        res.status(406).send({ status: "Error", message: "Invalid request" });
        return;
      }

      // check if refresh token is valid
      if (!existingUser.refreshTokens.includes(token)) {
        existingUser.refreshTokens = []; // invalidate all refresh tokens
        await existingUser.save();
        return res
          .status(407)
          .send({ status: "Error", message: "Invalid request" });
      }

      // the refresh token is valid, remove it from the user
      existingUser.refreshTokens = existingUser.refreshTokens.filter(
        (t) => t !== token
      );
      await existingUser.save();

      res.status(200).send({ status: "Success", message: "Logged out" });
    } catch (error) {
      res.status(400).send({ status: "Error", message: error.message });
      return;
    }
  });
};

const refresh = async (req: Request, res: Response) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    res.status(401).send({ status: "Error", message: "Access Denied" });
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res
      .status(500)
      .send({ status: "Error", message: "Missing auth configuration" });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload: payload) => {
    if (err || !payload) {
      res.status(403).send({ status: "Error", message: err.message });
      return;
    }
    try {
      const existingUser = await User.findById(payload._id);
      if (!existingUser) {
        res.status(403).send({ status: "Error", message: "Invalid request" });
        return;
      }

      // check if refresh token is valid
      if (!existingUser.refreshTokens.includes(token)) {
        existingUser.refreshTokens = []; // invalidate all refresh tokens
        await existingUser.save();
        res.status(403).send({ status: "Error", message: "Invalid request" });
        return;
      }

      // the refresh token is valid

      // Create a new access token
      const rand1 = Math.floor(Math.random() * 1000000);
      const accessToken = jwt.sign(
        { _id: existingUser._id, random: rand1 },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );

      // Create a new refresh token
      const rand2 = Math.floor(Math.random() * 1000000);
      const refreshToken = jwt.sign(
        { _id: existingUser._id, random: rand2 },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
      );

      // remove old refresh token and save the new one
      existingUser.refreshTokens = existingUser.refreshTokens.filter(
        (t) => t !== token
      );
      existingUser.refreshTokens.push(refreshToken);
      await existingUser.save();

      res.status(200).send({
        status: "Success",
        data: {
          _id: existingUser._id,
          username: existingUser.username,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      res.status(400).send({ status: "Error", message: error.message });
      return;
    }
  });
};

const authTestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) {
    res.status(401).send({ status: "Error", message: "Access Denied" });
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res
      .status(500)
      .send({ status: "Error", message: "Missing auth configuration" });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload: payload) => {
    if (err || !payload) {
      res.status(403).send({ status: "Error", message: err.message });
      return;
    }
    req.query._id = payload._id;
    next();
  });
};

const auth_controller = {
  register,
  login,
  logout,
  refresh,
  authTestMiddleware,
};
export default auth_controller;
