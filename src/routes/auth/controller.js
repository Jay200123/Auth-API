import { ErrorHandler, SuccessHandler } from "../../utils/index.js";
import { loginValidation } from "../../validations/index.js";
import { validationResult } from "express-validator";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
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
      return next(new ErrorHandler(422, requiredFields));
    }

    const data = await this.authService.login(
      req.body.email,
      req.body.password
    );

    return SuccessHandler(res, 200, data, "Login Successfully");
  }

  async logout(req, res, next) {}
}
