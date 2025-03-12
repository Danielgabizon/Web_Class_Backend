"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../models/users_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_info = req.body;
        // Check if all required fields are provided
        const requiredFields = [
            "username",
            "password",
            "email",
            "fname",
            "lname",
            "profileUrl",
        ];
        for (const field of requiredFields) {
            if (!user_info[field] || user_info[field] === "") {
                throw new Error("All fields are required");
            }
        }
        // Vaildate username format - 8 characters, letters and numbers only
        const usernameRegex = /^[A-Za-z0-9]{8,}$/;
        if (!usernameRegex.test(user_info.username)) {
            throw new Error("Username must be at least 8 characters long and include only letters and numbers");
        }
        // Validate password strength - 8 characters, 1 capital letter, 1 small letter, 1 number and 1 special character
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(user_info.password)) {
            throw new Error("Password must be at least 8 characters long and include at least 1 capital letter, 1 small letter, 1 number and 1 special character");
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_info.email)) {
            throw new Error("Invalid email");
        }
        // check if user already exists
        const existingUser = yield users_model_1.default.findOne({ username: user_info.username });
        if (existingUser) {
            throw new Error("Username already exists");
        }
        // check if email already exists
        const existingEmail = yield users_model_1.default.findOne({ email: user_info.email });
        if (existingEmail) {
            throw new Error("Email already exists");
        }
        // Hash password and save user
        const salt = yield bcrypt_1.default.genSalt(10);
        user_info.password = yield bcrypt_1.default.hash(user_info.password, salt);
        const newUser = yield users_model_1.default.create(user_info);
        res.status(201).send({
            status: "Success",
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                fname: newUser.fname,
                lname: newUser.lname,
                profileUrl: newUser.profileUrl,
            },
        });
        return;
    }
    catch (error) {
        res.status(400).send({ status: "Error", message: error.message });
        return;
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if all required fields are provided
        const { username, password } = req.body;
        if (!username || !password || username === "" || password === "")
            throw new Error("Username and password are required");
        // check if user exists
        const user = yield users_model_1.default.findOne({ username: username });
        if (!user) {
            throw new Error("Username or password is incorrect");
        }
        // check if password is correct
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            throw new Error("Username or password is incorrect");
        }
        // Create an access token
        const rand1 = Math.floor(Math.random() * 1000000);
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, random: rand1 }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        // Create a refresh token
        const rand2 = Math.floor(Math.random() * 1000000);
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, random: rand2 }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
        // save refresh token to db
        if (!user.refreshTokens)
            user.refreshTokens = [];
        user.refreshTokens.push(refreshToken);
        yield user.save();
        res.status(200).send({
            status: "Success",
            data: {
                _id: user._id,
                username: user.username,
                profileUrl: user.profileUrl,
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
        return;
    }
    catch (error) {
        res.status(400).send({ status: "Error", message: error.message });
        return;
    }
});
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error("Invalid token");
        }
        const email = payload.email;
        if (email) {
            let user = yield users_model_1.default.findOne({ email: email });
            if (!user) {
                user = yield users_model_1.default.create({
                    username: email.split("@")[0],
                    password: email + process.env.TOKEN_SECRET,
                    email: email,
                    fname: payload.given_name,
                    lname: payload.family_name,
                    profileUrl: payload.picture,
                });
            }
            // Create an access token
            const rand1 = Math.floor(Math.random() * 1000000);
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id, random: rand1 }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
            // Create a refresh token
            const rand2 = Math.floor(Math.random() * 1000000);
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, random: rand2 }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
            // save refresh token to db
            if (!user.refreshTokens)
                user.refreshTokens = [];
            user.refreshTokens.push(refreshToken);
            yield user.save();
            res.status(200).send({
                status: "Success",
                data: {
                    _id: user._id,
                    username: user.username,
                    profileUrl: user.profileUrl,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
            });
        }
    }
    catch (error) {
        res.status(400).send({ status: "Error", message: error.message });
        return;
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !payload) {
            res.status(403).send({ status: "Error", message: "Unauthorized" });
            return;
        }
        try {
            // get the user from the payload and check if it exists
            const user = yield users_model_1.default.findById(payload._id);
            if (!user) {
                res.status(404).send({ status: "Error", message: "User not found" });
                return;
            }
            // check if refresh token is valid
            if (!user.refreshTokens.includes(token)) {
                user.refreshTokens = []; // invalidate all refresh tokens
                yield user.save();
                return res
                    .status(403)
                    .send({ status: "Error", message: "Unauthorized" });
            }
            // the refresh token is valid, remove it from the user
            user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
            yield user.save();
            res
                .status(200)
                .send({ status: "Success", message: "Logged out successfully" });
        }
        catch (error) {
            res.status(400).send({ status: "Error", message: error.message });
            return;
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !payload) {
            res.status(403).send({ status: "Error", message: "Unauthorized" });
            return;
        }
        try {
            const user = yield users_model_1.default.findById(payload._id);
            if (!user) {
                res.status(404).send({ status: "Error", message: "User not found" });
                return;
            }
            // check if refresh token is valid
            if (!user.refreshTokens.includes(token)) {
                user.refreshTokens = []; // invalidate all refresh tokens
                yield user.save();
                res.status(403).send({ status: "Error", message: "Unauthorized" });
                return;
            }
            // the refresh token is valid, create a new access token and refresh token
            // Create a new access token
            const rand1 = Math.floor(Math.random() * 1000000);
            const new_accessToken = jsonwebtoken_1.default.sign({ _id: user._id, random: rand1 }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
            // Create a new refresh token
            const rand2 = Math.floor(Math.random() * 1000000);
            const new_refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, random: rand2 }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
            // Replace old refresh token
            user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
            user.refreshTokens.push(new_refreshToken);
            yield user.save();
            res.status(200).send({
                status: "Success",
                data: {
                    _id: user._id,
                    username: user.username,
                    accessToken: new_accessToken,
                    refreshToken: new_refreshToken,
                },
            });
        }
        catch (error) {
            res.status(400).send({ status: "Error", message: error.message });
            return;
        }
    }));
});
const authTestMiddleware = (req, res, next) => {
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
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err || !payload) {
            res.status(403).send({ status: "Error", message: "Unauthorized" });
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
    googleLogin,
    logout,
    refresh,
    authTestMiddleware,
};
exports.default = auth_controller;
//# sourceMappingURL=auth_controller.js.map