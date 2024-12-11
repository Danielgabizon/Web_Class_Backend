import { Request, Response } from "express";
import { Model } from "mongoose";
class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async addNewItem(req: Request, res: Response): Promise<Response> {
    try {
      const item = await this.model.create(req.body);
      return res.status(200).send({ status: "Success", data: item });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const filter: Record<string, any> = {};
      // Handle filters for posts
      if (req.query.sender) {
        filter.sender = req.query.sender;
      }
      if (req.query.title) {
        filter.title = req.query.title;
      }
      // Handle filters for users
      if (req.query.username) {
        filter.username = req.query.username;
      }
      if (req.query.email) {
        filter.email = req.query.email;
      }
      const items = await this.model.find(filter);
      return res.status(200).send({ status: "Success", data: items });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }

  async getItemById(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const item = await this.model.findById(itemId);
      if (!item) {
        return res
          .status(404)
          .send({ status: "Error", message: "item not found" });
      }
      return res.status(200).send({ status: "Success", data: item });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async updateItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const updateContent = req.body;
      // Update the item and return the updated document
      const updatedItem = await this.model.findByIdAndUpdate(
        itemId, // The ID of the item to update
        updateContent, // The content to update
        { new: true, runValidators: true } // Options: return the updated document and validate the update
      );
      if (!updatedItem) {
        return res
          .status(404)
          .send({ status: "Error", message: "item not found" });
      }
      return res.status(200).send({ status: "Success", data: updatedItem });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async deleteItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id;
      const item = await this.model.findByIdAndDelete(itemId);
      if (!item) {
        return res
          .status(404)
          .send({ status: "Error", message: "item not found" });
      }
      return res.status(200).send({ status: "Success", data: "" });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}

export default BaseController;
