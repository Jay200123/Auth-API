import express from "express";
import mongoose from "mongoose";
import { Connection, Environment } from "./src/config/index.js";
import { errorJson, errorHandler } from "./src/middleware/index.js";
import { users, auth } from "./src/routes/index.js";

const app = express();

/**
 * Environment variables
 * Create a new instance of environment class to call the load method which loads the environment variables from the .env file
 * Load environment variables from .env file
 */
const environment = new Environment();
environment.load();

/**
 * Database connection
 * Create a new instance of connection class to call the connect method which connects to the database
 * The connection class takes the database URI from the environment variables
 * The connection class uses mongoose to connect to the database
 */

const connection = new Connection(process.env.DATABASE_URI);
connection.connect();

/**
 * Middleware
 * Express json middleware to parse the request body as json
 * This middleware is used to parse the request body as json and make it available in the req.body object
 */
app.use(express.json());

/**
 * Default index route
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to the API",
    date: new Date().toLocaleString(),
  });
});

/**
 * Export routes here
 */
app.use("/api/v1", auth, users);

/**
 * Error handling middleware
 * This middleware is used to handle errors in the application
 * It will catch all errors thrown in the application
 * and return a json response with the error message and status code
 * The error middleware will also log the error message and status code to the console
 */
app.use(errorJson);
app.use(errorHandler);
/**
 * Catch all non existing routes
 */
app.get("/*splat", (req, res) => {
  return res.status(404).json({
    message: "Route not found",
    date: new Date().toLocaleString(),
  });
});

/**
 * Mongoose connection
 * This is the default connection event for mongoose
 * It will listen for the connection event and log the date and time when the connection is established
 * It will also listen for the error event and log the date and time when the connection fails
 */
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT);
  console.log(
    `Mongoose database connected running on port ${
      process.env.PORT
    } - ${new Date().toLocaleString()}`
  );
});

mongoose.connection.once("error", () => {
  console.log(
    "Error connecting to the database - ",
    new Date().toLocaleString()
  );
  process.exit(1);
});
