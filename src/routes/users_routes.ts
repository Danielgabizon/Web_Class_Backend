// importing Express and creating a Router instance:
import express, { Request, Response } from "express";
const router = express.Router();
// importing the controller functions that will handle the logic for each route.
import usersController from "../controllers/users_controller";
// setting Up the routes:

router.post("/", (req: Request, res: Response) => {
  usersController.addNewItem(req, res); // add new user
});
router.get("/", (req: Request, res: Response) => {
  usersController.getAllItems(req, res); // get all users
});
router.get("/:id", (req: Request, res: Response) => {
  usersController.getItemById(req, res); // get user by id
});
router.put("/:id", (req: Request, res: Response) => {
  usersController.updateItem(req, res); // update user by id
});
router.delete("/:id", (req: Request, res: Response) => {
  usersController.deleteItem(req, res); // delete user by id
});
//exporting the router so that it can be imported and used in other parts of application. F
export default router;
