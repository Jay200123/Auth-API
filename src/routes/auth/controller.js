import { ErrorHandler, SuccessHandler } from "../../utils/index.js";
import {
  registerUserValidation,
  loginValidation,
} from "../../validations/index.js";
import { validationResult } from "express-validator";
import { STATUSCODE } from "../../constants/index.js";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * This method creates a new user in the database.
   * It validates the user input using express-validator.
   * If validation fails, it returns a 422 error with the validation errors.
   * If validation passes, it inserts the user details into the database.
   * If the user is successfully created, it returns a 201 response with the user data.
   */
  async registerUser(req, res, next) {
    /**
     * Validate user input
     * If validation fails, return an error response with status code 422
     */
    await registerUserValidation(req);

    /**
     * Check if there are any validation errors
     * If there are errors, return an error response with status code 422
     * The errors are passed to the next middleware (error handler)
     */
    const errors = validationResult(req);

    /**
     * Map the errors into a more readable format
     * Each error contains a message and the path (field) that caused the error
     */
    const requiredFields = errors.array().map((err) => {
      return {
        message: err.msg,
        path: err.path,
      };
    });

    /**
     * If there are validation errors, return an error response
     * with status code 422 and the required fields
     */
    if (!errors.isEmpty()) {
      return next(
        new ErrorHandler(STATUSCODE.UNPROCESSABLE_ENTITY, requiredFields)
      );
    }

    /**
     * Insert users and user details into the database
     * The userService.add method is called to insert the user details into the database
     */
    const result = await this.authService.add(req.body);

    /**
     * Return success response with status code 201
     */
    return SuccessHandler(res, STATUSCODE.CREATED, result, "Success");
  }

  async login(req, res, next) {
    await loginValidation(req);

    const errors = validationResult(req);

    const requiredFields = errors?.array()?.map((err) => {
      return {
        message: err.msg,
        path: err.path,
      };
    });

    if (!errors.isEmpty()) {
      return next(
        new ErrorHandler(STATUSCODE.UNPROCESSABLE_ENTITY, requiredFields)
      );
    }

    const data = await this.authService.login(
      req.body.email,
      req.body.password
    );

    return SuccessHandler(res, STATUSCODE.OK, data, "Login Successfully");
  }

  async refreshToken(req, res, next) {
    const token = req?.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return next(new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized"));
    }

    const result = await this.authService.refreshToken(token);

    return SuccessHandler(res, STATUSCODE.OK, result, "Token Refreshed");
  }

  async logout(req, res, next) {
    const token = req?.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return next(new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Unauthorized"));
    }

    const result = await this.authService.logout(token);

    return SuccessHandler(res, STATUSCODE.OK, result, "Logout Successfully");
  }
}
