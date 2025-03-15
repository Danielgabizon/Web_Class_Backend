import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import bodyParser from "body-parser";
import gemini_routes from "./routes/gemini_routes"; // Import the Gemini routes
import path from "path";

import posts_routes from "./routes/posts_routes";
import auth_routes from "./routes/auth_routes";
import comments_routes from "./routes/comments_routes";
import users_routes from "./routes/users_routes";
import file_routes from "./routes/file_routes";
//
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
app.use("/gemini", gemini_routes);
app.use(express.static("front"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "front", "index.html"));
});


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT}` },
      { url: `http://10.10.246.62:${process.env.PORT}` },
      { url: `https://10.10.246.62:${process.env.PORT}` },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = async (): Promise<Express> => {
  if (!process.env.DB_CONNECT) {
    console.error("Missing auth configuration");
    throw new Error("Missing auth configuration");
  }

  try {
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("Connected to Database");
    return app;
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
};
export default initApp;
