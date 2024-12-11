import Users, { IUser } from "../models/users_model";
import BaseController from "./base_controller";

const userController = new BaseController<IUser>(Users);

export default userController;
