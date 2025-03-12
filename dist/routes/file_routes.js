"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
        cb(null, Date.now() + "." + ext);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const base = "http://localhost:3000";
router.post("/", upload.single("file"), (req, res) => {
    var _a;
    res.status(200).send({ url: base + "/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) });
});
exports.default = router;
//# sourceMappingURL=file_routes.js.map