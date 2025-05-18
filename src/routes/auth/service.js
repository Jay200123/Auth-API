import { STATUSCODE } from "../../constants/statusCode.js";
import { ErrorHandler } from "../../utils/index.js";
import { Hash } from "../../utils/index.js";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(UserModel, UserDetailsModel, TokenModel, JwtMiddleware) {
    this.userModel = UserModel;
    this.userDetailsModel = UserDetailsModel;
    this.tokenModel = TokenModel;
    this.jwt = JwtMiddleware;
  }

  async add(data) {
    const emailExists = await this.userModel.findOne({ email: data?.email });

    if (emailExists) {
      throw new ErrorHandler(409, "Email already exists");
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!regex.test(data.password)) {
      throw new ErrorHandler(
        400,
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    const hash = new Hash();
    const hashedPassword = await hash.hashPassword(data.password);

    const user = await this.userModel.create({
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const userDetails = await this.userDetailsModel.create({
      user: user._id,
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      address: data.address,
      city: data.city,
    });

    return {
      user: user,
      user_details: userDetails,
    };
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
     * Generate a refresh token using token and user id as payload.
     * The refresh token is used to generate a new access token
     * when the access token expires
     */
    const refresh_token = this.jwt.GenerateRefreshToken({
      token: token,
      _id: user?._id,
    });

    /**
     * Mongoose query for inserting the token into the database
     * The token is stored in the database for future reference
     */
    await this.tokenModel.create({
      access_token: token,
      refresh_token: refresh_token,
    });

    /**
     * The token is sent back to the client
     * along with the user data
     */

    return {
      user: user,
      access: token,
      refresh_token: refresh_token,
    };
  }

  async refreshAccessToken(refresh_token) {
    //Check if the refresh token exists in the database
    const refreshToken = await this.tokenModel.findOne({
      refresh_token: refresh_token,
    });

    //If the refresh token does not exist, throw an error
    if (!refreshToken) {
      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Invalid refresh token");
    }

    //Check if the refresh token is expired
    const decodedRefreshToken = this.jwt.ValidateToken(refresh_token);

    //If the refresh token is expired, throw an error
    if (!decodedRefreshToken) {
      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "Refresh Token Expired");
    }

    //Fetch the user from the database using the user id from the refresh token
    const user = await this.userModel.findById(decodedRefreshToken._id);

    //If the user does not exist, throw an error
    if (!user) {
      throw new ErrorHandler(STATUSCODE.UNAUTHORIZED, "User not found");
    }

    //Generate a new access token and refresh token using the user data
    const newAccessToken = this.jwt.GenerateToken({ user });

    //Generate a new refresh token using the new access token and user id as payload
    //The refresh token is used to generate a new access token when the access token expires
    const newRefreshToken = this.jwt.GenerateRefreshToken({
      token: token,
      _id: user?._id,
    });

    //Update the token in the database with the new access token and refresh token
    //The token is updated in the database for future reference
    await this.tokenModel.findOneAndUpdate(
      { refresh_token: refresh_token },
      {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      },
      { new: true }
    );

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(token) {
    /**
     * Mongoose query for deleting the token from the database
     * The token is deleted from the database to log the user out
     */

    return await this.tokenModel.findOneAndDelete({
      access_token: token,
    });
  }
}
