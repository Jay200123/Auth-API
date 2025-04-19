import User from "../users/model.js";
import Token from "./model.js";
import { AuthService } from "./service.js";
import { JWTMiddleware } from "../../middleware/index.js";
import { AuthController } from "./controller.js";
import express from "express";

const router = express.Router();
 
const authService = new AuthService(User, Token, new JWTMiddleware());
const authController = new AuthController(authService);

const authRoutes = [
  {
    method: "post",
    path: "/login",
    handler: authController.login.bind(authController),
  },
];

authRoutes.forEach((route) => {
  const { method, path, handler } = route;
  router[method](path, handler);
});

export default router;
