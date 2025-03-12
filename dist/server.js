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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const body_parser_1 = __importDefault(require("body-parser"));
const gemini_routes_1 = __importDefault(require("./routes/gemini_routes")); // Import the Gemini routes
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const users_routes_1 = __importDefault(require("./routes/users_routes"));
const file_routes_1 = __importDefault(require("./routes/file_routes"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use("/auth", auth_routes_1.default);
app.use("/posts", posts_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/users", users_routes_1.default);
app.use("/public/", express_1.default.static("public"));
app.use("/file", file_routes_1.default);
app.use("/gemini", gemini_routes_1.default);
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Web Dev 2025 REST API",
            version: "1.0.0",
            description: "REST server including authentication using JWT",
        },
        servers: [{ url: `http://localhost:${process.env.PORT}` }, { url: `http://10.10.246.62:${process.env.PORT}` },
            { url: `https://10.10.246.62:${process.env.PORT}` }
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.DB_CONNECT) {
        console.error("Missing auth configuration");
        throw new Error("Missing auth configuration");
    }
    try {
        yield mongoose_1.default.connect(process.env.DB_CONNECT);
        console.log("Connected to Database");
        return app;
    }
    catch (error) {
        console.error("Database connection failed", error);
        throw error;
    }
});
exports.default = initApp;
//# sourceMappingURL=server.js.map