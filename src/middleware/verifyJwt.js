import { ErrorHandler } from "../utils/index.js";

export class TokenMiddleware {
  constructor(JWTMiddleware, UserModel, TokenModel) {
    this.JwtMiddleware = JWTMiddleware;
    this.userModel = UserModel;
    this.tokenModel = TokenModel;
  }

  async verifyAccessToken(req, res, next) {
    try {
      /**
       * Extract token from the request headers
       * The token is expected to be in the format "Bearer
       */
      const token = req?.headers["authorization"].split(" ")[1];

      /**
       * If the token is not present in the database,
       * return an error response with status code 401 (Unauthorized)
       * This indicates that the token is not valid or has expired
       */
      const accessToken = await this.tokenModel.findOne({
        access_token: token,
      });

      if (!accessToken) {
        return next(new ErrorHandler(401, "Unauthorized"));
      }

      /**
       * Validate the token using the JWT middleware
       * If the token is invalid, return an error response with status code 401 (Unauthorized)
       * If the token is valid, proceed to the next middleware or route handler which is next()
       */
      const decoded = this.JwtMiddleware.ValidateToken(token);
      if (!decoded) {
        return next(new ErrorHandler(401, "Token Expired"));
      }

      /**
       * Find the user associated with the token in the database
       * The user ID is extracted from the decoded token data
       */
      const user = await this.userModel.findById(decoded?.user?._id);

      /**
       * If the user is not found, return an error response with status code 401 (Unauthorized)
       * This indicates that the token is not valid or the user does not exist
       */
      if (!user) {
        return next(new ErrorHandler(401, "Unauthorized"));
      }
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
