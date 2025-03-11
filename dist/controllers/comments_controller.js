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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
class commentsController extends base_controller_1.default {
    constructor(model) {
        super(model);
    }
    addNewItem(req, res) {
        const _super = Object.create(null, {
            addNewItem: { get: () => super.addNewItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const senderId = req.query.userId; // The ID of the user making the comment
                const postId = req.params.postId; // The ID of the post to comment on
                // check if the post exists
                const post = yield posts_model_1.default.findById(postId);
                if (!post) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "Post not found" });
                }
                const content = req.body.content; // The content of the comment
                if (!content || content.trim() === "") {
                    throw new Error("Please provide a comment's content");
                }
                req.body = Object.assign(Object.assign({}, req.body), { postId: postId, sender: senderId }); // Add the post ID and sender ID to the comment
                return yield _super.addNewItem.call(this, req, res);
            }
            catch (error) {
                return res.status(400).send({ status: "Error", message: error.message });
            }
        });
    }
    getAllItems(req, res) {
        const _super = Object.create(null, {
            getAllItems: { get: () => super.getAllItems }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = req.query.postId
                    ? { postId: req.query.postId }
                    : {};
                if (Object.keys(filter).length > 0) {
                    // If a filter is applied
                    const comments = yield comments_model_1.default.find(filter);
                    return res.status(200).send({ status: "Success", data: comments });
                }
                return yield _super.getAllItems.call(this, req, res); // Call the base implementation if no filter is applied
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
    updateItem(req, res) {
        const _super = Object.create(null, {
            updateItem: { get: () => super.updateItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId; // The user ID from query from auth token
                // retrieving the existing comment to check ownership
                const commentId = req.params.id; // The ID of the comment to update
                const existingComment = yield this.model.findById(commentId);
                if (!existingComment) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "Comment not found" });
                }
                // Check if the user is the owner of the comment
                if (existingComment.sender.toString() !== userId) {
                    return res.status(403).send({
                        status: "Error",
                        message: "Unauthorized",
                    });
                }
                const content = req.body.content; // The content of the comment
                if (!content || content.trim() === "") {
                    throw new Error("Please provide a comment's content");
                }
                return yield _super.updateItem.call(this, req, res);
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
    deleteItem(req, res) {
        const _super = Object.create(null, {
            deleteItem: { get: () => super.deleteItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId; // The user ID from query from auth token
                // retrieving the existing comment to check ownership
                const commentId = req.params.id; // The ID of the comment to delete
                const existingComment = yield this.model.findById(commentId);
                if (!existingComment) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "Comment not found" });
                }
                // Check if the user is the owner of the comment
                if (existingComment.sender.toString() !== userId) {
                    return res.status(403).send({
                        status: "Error",
                        message: "Unauthorized",
                    });
                }
                return yield _super.deleteItem.call(this, req, res);
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
}
exports.default = new commentsController(comments_model_1.default);
//# sourceMappingURL=comments_controller.js.map