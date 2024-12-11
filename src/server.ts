import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import bodyParser from "body-parser";
import users_routes from "./routes/users_routes";
import posts_routes from "./routes/posts_routes";
import comments_routes from "./routes/comments_routes";

const initApp = (): Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
    if (!process.env.DB_CONNECT) {
      console.error("Please add a MongoDB URI in the .env file");
      reject("No MongoDB URI");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          console.log("Database connected");
          app.use(bodyParser.json());
          app.use(bodyParser.urlencoded({ extended: true }));
          app.use("/users", users_routes);
          app.use("/posts", posts_routes);
          app.use("/comments", comments_routes);
          resolve(app);
        })
        .catch((error) => {
          console.error("Database connection failed", error);
          reject(error);
        });
    }
  });
};
export default initApp;
