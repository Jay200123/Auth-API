import { TokenMiddleware } from "./verifyJwt.js";
import { JWTMiddleware } from "./jwt.js";

export class RoleMiddleware extends TokenMiddleware {
  /**
   * The constructor initializes the RoleMiddleware class with a JWTMiddleware instance.
   * @param {JWTMiddleware} JWTMiddleware - An instance of the JWTMiddleware class.
   */
  constructor() {
    super(new JWTMiddleware());
  }

  userRole(...roles) {
    return async (req, res, next) => {
      try {
        const token = req?.headers["authorization"].split(" ")[1];

        const decoded = this.JwtMiddleware.ValidateToken(token);
        if (!roles?.includes(decoded?.user?.roles)) {
          return next(new ErrorHandler(401, "Unauthorized"));
        }
        next();
      } catch (err) {
        return next(new ErrorHandler(401, "Unauthorized"));
      }
    };
  }
}
