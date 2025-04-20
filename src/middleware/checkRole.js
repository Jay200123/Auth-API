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

  /**
   *
   * @param  {...any} roles - The roles to check against the user's roles.
   * @returns
   */
  userRole(...roles) {
    return async (req, res, next) => {
      try {
        /**
         * Check if the user is authenticated and has the required role.
         * If the user is not authenticated or does not have the required role,
         *  return an error.
         */
        const token = req?.headers["authorization"].split(" ")[1];

        /**
         * Check if the token is valid and decode it to get the user information.
         * If the token is invalid, return an error.
         */
        const decoded = this.JwtMiddleware.ValidateToken(token);

        /**
         * Check if the user has the required role.
         * If the user does not have the required role,
         *  return an error.
         */
        if (!roles?.includes(decoded?.user?.roles)) {
          return next(new ErrorHandler(403, "Forbidden"));
        }
        next();
      } catch (err) {
        return next(new ErrorHandler(403, "Forbidden"));
      }
    };
  }
}
