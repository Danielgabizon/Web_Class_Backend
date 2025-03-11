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
const posts_model_1 = __importDefault(require("../models/posts_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const comments_model_1 = __importDefault(require("../models/comments_model"));
class PostsController extends base_controller_1.default {
    constructor(model) {
        super(model);
    }
    addNewItem(req, res) {
        const _super = Object.create(null, {
            addNewItem: { get: () => super.addNewItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId; // The user Id
                const { title, content } = req.body;
                if (!title || title.trim() === "") {
                    throw new Error("Please provide a post's title");
                }
                if (!content || content.trim() === "") {
                    throw new Error("Please provide a post's content");
                }
                req.body = Object.assign(Object.assign({}, req.body), { sender: userId }); // add the sender to the request body
                return yield _super.addNewItem.call(this, req, res); // call the base implementation
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
                const filter = req.query.sender ? { sender: req.query.sender } : {};
                if (filter) {
                    const posts = yield this.model.find(filter);
                    return res.status(200).send({ status: "Success", data: posts });
                }
                // call the base implementation if no specific filter is applied
                return yield _super.getAllItems.call(this, req, res);
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
                const postId = req.params.id; // The post's ID
                const userId = req.query.userId; // The user ID from query from auth token
                // retrieving the existing post to check ownership
                const existingPost = yield this.model.findById(postId);
                if (!existingPost) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "Post not found" });
                }
                // Check if the user is the owner of the post
                if (existingPost.sender.toString() !== userId) {
                    return res.status(403).send({
                        status: "Error",
                        message: "Unauthorized",
                    });
                }
                const { title, content } = req.body;
                if (!title || title.trim() === "") {
                    throw new Error("Please provide a post's title");
                }
                if (!content || content.trim() === "") {
                    throw new Error("Please provide a post's content");
                }
                return yield _super.updateItem.call(this, req, res); // Call the base implementation
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
                const postId = req.params.id; // The post's ID
                const userId = req.query.userId; // The user ID from query from auth token
                // retrieving the existing post to check ownership
                const existingPost = yield this.model.findById(postId);
                if (!existingPost) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "Post not found" });
                }
                // Check if the user is the owner of the post
                if (existingPost.sender.toString() !== userId) {
                    return res.status(403).send({
                        status: "Error",
                        message: "Unauthorized",
                    });
                }
                // delete all comments associated with the post
                yield comments_model_1.default.deleteMany({ postId: postId });
                // call the base implementation
                return yield _super.deleteItem.call(this, req, res);
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
}
const postController = new PostsController(posts_model_1.default);
exports.default = postController;
//# sourceMappingURL=posts_controller.js.map