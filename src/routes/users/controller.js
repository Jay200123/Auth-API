import { SuccessHandler, ErrorHandler } from "../../utils/index.js";
import { validationResult } from "express-validator";
import { userValidation } from "../../validations/index.js";

export class UserController {
  constructor(userService, userDetailsService) {
    this.userService = userService;
    this.userDetailsService = userDetailsService;
  }

  async getAllUsers(req, res, next) {
    const result = await this.userService.getAll();

    return result?.length === 0
      ? next(new ErrorHandler(404, "No users found"))
      : SuccessHandler(res, 200, result, "Users retrieved successfully");
  }

  async getOneUser(req, res, next) {
    const result = await this.userService.getById(req.params.id);
    return result?.length === 0
      ? next(new ErrorHandler(404, "User not found"))
      : SuccessHandler(res, 200, result, "Success");
  }

  async createUser(req, res, next) {
    /**
     * Validate user input
     * If validation fails, return an error response with status code 422
     */
    await userValidation(req);

    /**
     * Check if there are any validation errors
     * If there are errors, return an error response with status code 422
     * The errors are passed to the next middleware (error handler)
     */
    const errors = validationResult(req);

    const requiredFields = errors.array().map((err) => {
      return {
        message: err.msg,
        path: err.path,
      };
    });

    if (!errors.isEmpty()) {
      return next(new ErrorHandler(422, requiredFields));
    }

    /**
     * Insert users and user details into the database
     * The userService.add method is called to insert the user details into the database
     */
    const result = await this.userService.add(req.body);
  
    /**
     * If result is a success then user details will be inserted
     */
    if (result) {
      await this.userDetailsService.createUserDetails(result?._id, req.body);
    }

    /**
     * Return success response with status code 201
     */
    return SuccessHandler(res, 201, result, "Success");
  }

  async updateUser(req, res, next) {
    const user = await this.userService.getById(req.params.id);

    if (user.length === 0) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const data = await this.userService.updateById(req.params.id, req.body);

    return SuccessHandler(res, 200, data, "Success");
  }

  async deleteUser(req, res, next) {
    const result = await this.userService.deleteById(req.params.id);
    return SuccessHandler(res, 200, result, "User deleted successfully");
  }
}
