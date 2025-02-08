import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import bodyParser from "body-parser";

import posts_routes from "./routes/posts_routes";
import auth_routes from "./routes/auth_routes";
import comments_routes from "./routes/comments_routes";
import users_routes from "./routes/users_routes";
import file_routes from "./routes/file_routes";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/auth", auth_routes);
app.use("/posts", posts_routes);
app.use("/comments", comments_routes);
app.use("/users", users_routes);
app.use("/public/", express.static("public"));
app.use("/file", file_routes);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = (): Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
    if (!process.env.DB_CONNECT) {
      console.error("Missing auth configuration");
      reject("Missing auth configuration");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          console.log("Database connected");
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
