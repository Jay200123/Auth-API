import User from "../users/model.js";
import UserDetails from "../user_details/model.js";
import Token from "./model.js";
import { AuthService } from "./service.js";
import { JWTMiddleware } from "../../middleware/index.js";
import { AuthController } from "./controller.js";
import express from "express";
import { METHOD, PATH } from "../../constants/index.js";

const router = express.Router();

const authService = new AuthService(
  User,
  UserDetails,
  Token,
  new JWTMiddleware()
);
const authController = new AuthController(authService);

const authRoutes = [
  {
    method: METHOD.GET,
    path: PATH.REGISTER,
    handler: authController.registerUser.bind(authController),
  },
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    handler: authController.login.bind(authController),
  },
  {
    method: METHOD.POST,
    path: PATH.LOGOUT,
    handler: authController.logout.bind(authController),
  },
];

authRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

export default router;
