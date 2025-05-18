export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const SuccessHandler = (res, statusCode, data, message) => {
  return res.status(statusCode).json({
    status: statusCode,
    details: data,
    message: message,
  });
};
