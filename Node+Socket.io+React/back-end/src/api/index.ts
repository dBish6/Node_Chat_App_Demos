/*
 * Api Entry File
 */

import express from "express";

import bodyParser from "body-parser";
import { corsOptions } from "../server";
import cors from "cors";

import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler";

import chatRouter from "./routes/chatRoute";

const initializeApi = async () => {
  const app = express(),
    baseUrl = "/api";

  // **Middleware**
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // *Security*
  app.use(cors(corsOptions));
  app.use(helmet()); // Protects various HTTP headers that can help defend against common web hacks.
  app.use(hpp()); // Protects against HTTP Parameter Pollution attacks.
  // Rate-limiting - used to limit repeated requests.
  app.use((req, res, next) => {
    rateLimit({
      windowMs: 60 * 60 * 1000, // 60 Minutes
      max: 55, // limit each IP to 55 requests per windowMs.
      message:
        "Too many requests made from this IP, please try again after an hour.",
    })(req, res, next);
  });

  // Request logger.
  morgan.token("all-headers", (req) => {
    return JSON.stringify(req.headers, null, 2);
  });
  // app.use(
  //   morgan(":method :url :status :response-time ms \n headers: :all-headers")
  // );
  app.use(morgan("dev"));

  // Custom error handler.
  app.use(errorHandler);

  // *Routers*
  app.use(`${baseUrl}/chat`, chatRouter);

  // Test Route
  app.get("/", async (req, res) => {
    res.json({ message: "Hello from the back-end!" });
  });

  return app;
};

export default initializeApi;
