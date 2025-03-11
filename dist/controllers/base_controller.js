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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor(model) {
        this.model = model;
    }
    addNewItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield this.model.create(req.body);
                return res.status(201).send({ status: "Success", data: item });
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
    getAllItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.model.find();
                return res.status(200).send({ status: "Success", data: items });
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
    getItemById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const item = yield this.model.findById(itemId);
                if (!item) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "item not found" });
                }
                return res.status(200).send({ status: "Success", data: item });
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const updateContent = req.body;
                // Update the item and return the updated document
                const updatedItem = yield this.model.findByIdAndUpdate(itemId, // The ID of the item to update
                updateContent, // The content to update
                { new: true, runValidators: true } // Options: return the updated document and validate the update
                );
                return res.status(200).send({ status: "Success", data: updatedItem });
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = req.params.id;
                const item = yield this.model.findByIdAndDelete(itemId);
                if (!item) {
                    return res
                        .status(404)
                        .send({ status: "Error", message: "item not found" });
                }
                return res.status(200).send({ status: "Success", data: "" });
            }
            catch (err) {
                return res.status(400).send({ status: "Error", message: err.message });
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map