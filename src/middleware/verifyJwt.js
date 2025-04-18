import { ErrorHandler } from "../utils/index.js";

export class TokenMiddleware {
  constructor(JWTMiddleware) {
    this.JwtMiddleware = JWTMiddleware;
  }

  async verifyAccessToken(req, res, next) {
    try {
      /**
       * Extract token from the request headers
       * The token is expected to be in the format "Bearer
       */
      const token = req?.headers["authorization"].split(" ")[1];

      /**
       * Validate the token using the JWT middleware
       * If the token is invalid, return an error response with status code 401 (Unauthorized)
       * If the token is valid, proceed to the next middleware or route handler which is next()
       */
      const decoded = this.JwtMiddleware.ValidateToken(token);
      if (!decoded) {
        return next(new ErrorHandler(401, "Unauthorized"));
      }

      /**
       * Attach the decoded token data to the request object
       * This allows subsequent middleware or route handlers to access the user information
       * from the token
       */
      next();
    } catch (err) {
      /**
       * If an error occurs during token validation,
       * return an error response with status code 401 (Unauthorized)
       */
      return next(new ErrorHandler(401, "Unauthorized"));
    }
  }
}
