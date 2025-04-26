import User from "../users/model.js";
import UserDetails from "../user_details/model.js";
import Token from "./model.js";
import { AuthService } from "./service.js";
import {
  JWTMiddleware,
  TokenMiddleware,
  RoleMiddleware,
} from "../../middleware/index.js";
import { AuthController } from "./controller.js";
import express from "express";
import { METHOD, PATH, ROLE } from "../../constants/index.js";

const router = express.Router();

const authService = new AuthService(
  User,
  UserDetails,
  Token,
  new JWTMiddleware()
);
const authController = new AuthController(authService);
const tokenMiddleware = new TokenMiddleware(new JWTMiddleware(), User, Token);
const roleMiddleware = new RoleMiddleware();

const authRoutes = [
  {
    method: METHOD.GET,
    path: PATH.REGISTER,
    role: [],
    middleware: [],
    handler: authController.registerUser.bind(authController),
  },
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    role: [],
    middleware: [],
    handler: authController.login.bind(authController),
  },
  {
    method: METHOD.GET,
    path: PATH.REFRESH_TOKEN,
    role: [ROLE.ADMIN, ROLE.USER],
    middleware: [tokenMiddleware.verifyAccessToken.bind(tokenMiddleware)],
    handler: authController.refreshToken.bind(authController),
  },
  {
    method: METHOD.POST,
    path: PATH.LOGOUT,
    role: [],
    middleware: [],
    handler: authController.logout.bind(authController),
  },
];

authRoutes.forEach((route) => {
  const { method, path, role = [], middleware = [], handler } = route;
  router[method](path, middleware, roleMiddleware.userRole(...role), handler);
});

export default router;
