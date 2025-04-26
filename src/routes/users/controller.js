import { SuccessHandler, ErrorHandler } from "../../utils/index.js";
import { editUserValidation } from "../../validations/index.js";
import { validationResult } from "express-validator";
import { STATUSCODE } from "../../constants/index.js";
/**
 * UserController class handles user-related operations
 * such as retrieving, creating, updating, and deleting users.
 * It uses the userService to perform these operations.
 * The class methods handle incoming requests and send appropriate responses.
 */
export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   *
   * This method retrieves all users from the database.
   * If no users are found, it returns a 404 error.
   * If users are found, it returns a 200 response with the user data.
   */
  async getAllUsers(req, res, next) {
    const result = await this.userService.getAll();

    return result?.length === 0
      ? next(new ErrorHandler(STATUSCODE.NOT_FOUND, "No users found"))
      : SuccessHandler(
          res,
          STATUSCODE.OK,
          result,
          "Users retrieved successfully"
        );
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * This method retrieves a single user by ID from the database.
   * If the user is not found, it returns a 404 error.
   * If the user is found, it returns a 200 response with the user data.
   * The user ID is passed as a parameter in the request URL.
   */
  async getOneUser(req, res, next) {
    const result = await this.userService.getById(req.params.id);
    return result?.length === 0
      ? next(new ErrorHandler(STATUSCODE.NOT_FOUND, "User not found"))
      : SuccessHandler(res, STATUSCODE.OK, result, "Success");
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * This method updates a user by ID in the database.
   * It validates the user input using express-validator.
   * If validation fails, it returns a 422 error with the validation errors.
   * If validation passes, it updates the user details in the database.
   * If the user is successfully updated, it returns a 200 response with the updated user data.
   * The user ID is passed as a parameter in the request URL.
   */
  async updateUser(req, res, next) {
    /**
     * Validate user input
     * If validation fails, return an error response with status code 422
     * The errors are passed to the next middleware (error handler)
     * The user ID is passed as a parameter in the request URL
     * The updated user data is passed in the request body
     */

    /**
     * Call the editUserValidation method to validate the user input
     * The method checks if the user ID is provided in the request parameters
     * and if the required fields are present in the request body
     * If validation fails, it returns an error response with status code 422
     */
    await editUserValidation(req);

    /**
     * Check if there are any validation errors
     */
    const errors = validationResult(req);

    /**
     * Map the errors into a more readable format
     * Each error contains a message and the path (field) that caused the error
     */
    const requiredFields = errors?.array()?.map((err) => {
      return {
        path: err.path,
        message: err.msg,
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
     * Check if the user data exists by ID
     */
    const user = await this.userService.getById(req.params.id);

    /**
     * If the user does not exists,
     * return an error response with status code 404
     */
    if (user.length === 0) {
      return next(new ErrorHandler(STATUSCODE.NOT_FOUND, "User not found"));
    }

    /**
     * Update user details in the database
     * The userService.updateById method is called to update the user details in the database
     * The user ID is passed as a parameter in the request URL
     * The updated user data is passed in the request body
     */
    const data = await this.userService.updateById(req.params.id, req.body);

    /**
     * If the user details are successfully updated,
     * return a success response with status code 200
     */
    return SuccessHandler(res, STATUSCODE.OK, data, "Success");
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * This method deletes a user by ID from the database.
   * If the user is not found, it returns a 404 error.
   * If the user is found, it deletes the user and returns a 200 response with a success message.
   * The user ID is passed as a parameter in the request URL.
   */
  async deleteUser(req, res, next) {
    const result = await this.userService.deleteById(req.params.id);
    return SuccessHandler(
      res,
      STATUSCODE.OK,
      result,
      "User deleted successfully"
    );
  }
}
