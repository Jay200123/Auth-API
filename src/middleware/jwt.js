import jwt from "jsonwebtoken";

export class JWTMiddleware {
  GenerateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  ValidateToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
