import express from "express";
import User from "./model.js";
import UserDetails from "../user_details/model.js";
import Token from "../auth/model.js";
import { UserDetailsService } from "../user_details/service.js";
import { UserService } from "./service.js";
import { UserController } from "./controller.js";
import {
  JWTMiddleware,
  TokenMiddleware,
  RoleMiddleware,
} from "../../middleware/index.js";

/**
 * Dependency Injection
 */
const usersDetailsService = new UserDetailsService(UserDetails);
const usersService = new UserService(User, UserDetails);
const usersController = new UserController(usersService, usersDetailsService);

const tokenMiddleware = new TokenMiddleware(new JWTMiddleware(), User, Token);
const roleMiddleware = new RoleMiddleware();

const router = express.Router();

const userRoutes = [
  {
    method: "get",
    path: "/users/all",
    role: ["Admin"],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.getAllUsers.bind(usersController),
  },
  {
    method: "get",
    path: "/user/:id",
    role: ["Admin"],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.getOneUser.bind(usersController),
  },
  {
    method: "post",
    path: "/user/create",
    role: ["Admin"],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.createUser.bind(usersController),
  },
  {
    method: "patch",
    path: "/user/edit/:id",
    role: ["Admin"],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.updateUser.bind(usersController),
  },
  {
    method: "delete",
    path: "/user/delete/:id",
    role: ["Admin"],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.deleteUser.bind(usersController),
  },
];

userRoutes.forEach((route) => {
  const { method, path, role = [], middleware = [], handler } = route;
  router[method](
    path,
    middleware,
    roleMiddleware.userRole(...role),
    handler
  );
});

export default router;
