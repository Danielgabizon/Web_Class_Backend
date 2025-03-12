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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.username ? { username: req.query.username } : {};
        const users = yield users_model_1.default.find(filter).select("-password -refreshTokens");
        res.status(200).json({
            status: "Success",
            data: users,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Error",
            message: "An error occurred",
        });
    }
});
const getUserDetailsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield users_model_1.default.findById(userId).select("-password -refreshTokens");
        if (!user) {
            res.status(404).send({ status: "Error", message: "User not found" });
            return;
        }
        res.status(200).send({ status: "Success", data: user });
    }
    catch (err) {
        res.status(400).send({ status: "Error", message: err.message });
    }
});
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user_info = req.body;
        const requiredFields = ["username", "email", "fname", "lname"];
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
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_info.email)) {
            throw new Error("Invalid email");
        }
        // check if user already exists
        const existingUser = yield users_model_1.default.findOne({ username: user_info.username });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error("Username already exists");
        }
        // check if email already exists
        const existingEmail = yield users_model_1.default.findOne({ email: user_info.email });
        if (existingEmail && existingEmail._id.toString() !== userId) {
            throw new Error("Email already exists");
        }
        // Update
        const updatedUser = yield users_model_1.default.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true } // Return updated document
        ).select("-password -refreshToken");
        res.status(200).send({ status: "Success", data: updatedUser });
    }
    catch (err) {
        res.status(400).send({ status: "Error", message: err.message });
    }
});
exports.default = {
    getUserDetailsById,
    getAllUsers,
    updateUserDetails,
};
//# sourceMappingURL=user_controller.js.map