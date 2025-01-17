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
      if (!user_info[field]) {
        throw new Error("${field} is required");
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

    // Hash password and save user
    const salt = await bycrypt.genSalt(10);
    user_info.password = await bycrypt.hash(user_info.password, salt);
    const newUser = await User.create(user_info);
    res.status(201).send({ status: "Success", data: newUser });
    return;
  } catch (error) {
    res.status(400).send({ status: "Error", message: error.message });
    return;
  }
};
const login = async (req: Request, res: Response) => {
  try {
    // Check if all required fields are provided
    const { username, password } = req.body;
    if (!username || !password)
      throw new Error("Username and password are required");

    // check if user exists
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("Username or password is incorrect");
    }

    // check if password is correct
    const validPassword = await bycrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("User or password is incorrect");
    }

    // Create an access token
    const rand1 = Math.floor(Math.random() * 1000000);
    const accessToken = jwt.sign(
      { _id: user._id, random: rand1 },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    // Create a refresh token
    const rand2 = Math.floor(Math.random() * 1000000);
    const refreshToken = jwt.sign(
      { _id: user._id, random: rand2 },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );

    // save refresh token to db
    if (!user.refreshTokens) user.refreshTokens = [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(200).send({
      status: "Success",
      data: {
        _id: user._id,
        username: user.username,
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
    res.status(401).send({ status: "Error", message: "Access Denied" });
    return;
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(500).send({
      status: "Error",
      message: "Missing authentication configuration",
    });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload: payload) => {
    if (err || !payload) {
      res.status(403).send({ status: "Error", message: "Invalid token" });
      return;
    }
    try {
      // get the user from the payload and check if it exists
      const user = await User.findById(payload._id);
      if (!user) {
        res.status(404).send({ status: "Error", message: "User not found" });
        return;
      }

      // check if refresh token is valid
      if (!user.refreshTokens.includes(token)) {
        user.refreshTokens = []; // invalidate all refresh tokens
        await user.save();
        return res
          .status(403)
          .send({ status: "Error", message: "Invalid token" });
      }

      // the refresh token is valid, remove it from the user
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      await user.save();

      res
        .status(200)
        .send({ status: "Success", message: "Logged out successfully" });
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
    res.status(500).send({
      status: "Error",
      message: "Missing authentication configuration",
    });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload: payload) => {
    if (err || !payload) {
      res.status(403).send({ status: "Error", message: "Invalid Token" });
      return;
    }
    try {
      const user = await User.findById(payload._id);
      if (!user) {
        res.status(404).send({ status: "Error", message: "User not found" });
        return;
      }

      // check if refresh token is valid
      if (!user.refreshTokens.includes(token)) {
        user.refreshTokens = []; // invalidate all refresh tokens
        await user.save();
        res.status(403).send({ status: "Error", message: "Invalid token" });
        return;
      }

      // the refresh token is valid, create a new access token and refresh token

      // Create a new access token
      const rand1 = Math.floor(Math.random() * 1000000);
      const new_accessToken = jwt.sign(
        { _id: user._id, random: rand1 },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }
      );

      // Create a new refresh token
      const rand2 = Math.floor(Math.random() * 1000000);
      const new_refreshToken = jwt.sign(
        { _id: user._id, random: rand2 },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
      );

      // Replace old refresh token
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      user.refreshTokens.push(new_refreshToken);
      await user.save();

      res.status(200).send({
        status: "Success",
        data: {
          _id: user._id,
          username: user.username,
          accessToken: new_accessToken,
          refreshToken: new_refreshToken,
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
    res.status(500).send({
      status: "Error",
      message: "Missing authentication configuration",
    });
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload: payload) => {
    if (err || !payload) {
      res
        .status(403)
        .send({ status: "Error", message: "Invalid or expired token" });
      return;
    }
    // Attach user ID to request for downstream handlers
    req.query.userId = payload._id;
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
