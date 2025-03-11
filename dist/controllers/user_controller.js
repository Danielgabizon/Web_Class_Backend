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
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { username } = req.body;
        if (!username || username.trim() === "")
            throw new Error("Please provide a username");
        // Check if the username is already taken by another user
        const existingUser = yield users_model_1.default.findOne({ username });
        if (existingUser && existingUser.id !== userId)
            throw new Error("Username already taken");
        // Update
        const updatedUser = yield users_model_1.default.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true } // Return updated document
        ).select("-password -refreshToken");
        res.status(200).send({ status: "Success", data: updatedUser });
    }
    catch (err) {
        res.status(400).send({ status: "Error", message: err.message });
    }
});
exports.default = { getUserDetails, updateUserDetails };
//# sourceMappingURL=user_controller.js.map