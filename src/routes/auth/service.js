import { ErrorHandler } from "../../utils/index.js";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(UserModel, TokenModel, JwtMiddlware) {
    this.userModel = UserModel;
    this.tokenModel = TokenModel;
    this.jwt = JwtMiddlware;
  }
  async login(email, password) {
    /**
     * Check if the email sent in the request exists in the database
     */
    const user = await this.userModel.findOne({ email });

    /**
     * If the user is empty then an error is thrown
     * indicating that the Account was not found in the database
     */
    if (!user) {
      throw new ErrorHandler(404, "Email not found");
    }

    /**
     * Check if the password sent in the request matches the password in the database
     */
    const hasMatch = await bcrypt.compare(password, user?.password);

    /**
     * If hasMatch is false, meaning the password does not match the password in the database
     * throw an error
     */
    if (!hasMatch) {
      throw new ErrorHandler(401, "Invalid credentials");
    }

    /**
     * Generate a JWT token using the user data
     * and store it in the database
     */
    const token = this.jwt.GenerateToken({ user });

    /**
     * Mongoose query for inserting the token into the database
     * The token is stored in the database for future reference
     */
    await this.tokenModel.create({
      access_token: token,
    });

    /**
     * The token is sent back to the client
     * along with the user data
     */
    const data = {
      user: user,
      access: token,
    };

    return data;
  }

  async logout(token) {}
}
