import { ErrorHandler } from "../utils/index.js";

  /**
   * errorJson is used to catch and ensure that all errors thrown in the application
   * are handled as ErrorHandler instances.
   * This middleware is used to implement consistency in handling errors in the application.
   */
  export const errorJson = (err, req, res, next) => {
    const statusCode = err?.statusCode || 500; 
    const message = err?.message || "Internal Server Error";

    if (!(err instanceof ErrorHandler)) {
      err = new ErrorHandler(statusCode, message);
    }

    next(err);
  };
  /**
   * errorHandler is used to handle errors in the application.
   * This middleware is used to catch all errors thrown in the application
   * and return a json response with the error message and status code.
   */
  export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
      status: "Failed",
      message: message,
    });
  };
