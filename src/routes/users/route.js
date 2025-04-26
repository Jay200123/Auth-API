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
import { METHOD, PATH, ROLE } from "../../constants/index.js";

/**
 * Dependency Injection
 */

/**
 * @description: This code sets up the routes for user management in an Express application.
 * It imports necessary modules and classes, creates instances of services and controllers, and defines routes for user operations such as getting all users, creating a user, updating a user, and deleting a user.
 * Each route is associated with a specific HTTP method and path, and middleware is applied for token verification and role-based access control.
 */

/**
 * Create a new instance of userDetail Service referring to the UserDetails model.
 */
const usersDetailsService = new UserDetailsService(UserDetails);
/**
 * Create a new instance of user Service referring to the User model and UserDetails model.
 */
const usersService = new UserService(User, UserDetails);

/**
 * Create a new instance of user Controller referring to the UserService and UserDetailsService.
 * This controller will handle the business logic for user management.
 * It uses the UserValidation class for validating user input.
 * The UserValidation class is responsible for validating user data before it is processed by the controller.
 * It ensures that the data meets the required format and constraints.
 * The controller methods are bound to the instance of the controller to maintain the correct context when they are called.
 */
const usersController = new UserController(usersService, usersDetailsService);

/**
 * Create a new instance of TokenMiddleware referring to the JWTMiddleware, User model and Token model.
 */
const tokenMiddleware = new TokenMiddleware(new JWTMiddleware(), User, Token);
/**
 * Create a new instance of RoleMiddleware.
 */
const roleMiddleware = new RoleMiddleware();

/**
 * Create a new instance of express Router.
 * This router will be used to define the routes for user management.
 */
const router = express.Router();

/**
 * Define the routes for user management.
 * Each route is an object with properties such as method, path, role, middleware, and handler.
 * The method property specifies the HTTP method (GET, POST, PATCH, DELETE) for the route.
 * The path property specifies the URL path for the route.
 * The role property specifies the roles that are allowed to access the route.
 * The middleware property specifies the middleware functions that should be applied to the route.
 * Each handlers is an async method from userContoller that binds to the userController instance.
 */
const userRoutes = [
  {
    method: METHOD.GET,
    path: PATH.ALL_USERS,
    role: [ROLE.ADMIN],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.getAllUsers.bind(usersController),
  },
  {
    method: METHOD.GET,
    path: PATH.ONE_USER,
    role: [ROLE.ADMIN],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.getOneUser.bind(usersController),
  },
  {
    method: METHOD.PATCH,
    path: PATH.UPDATE_USER,
    role: [ROLE.ADMIN],
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.updateUser.bind(usersController),
  },
  {
    method: METHOD.DELETE,
    path: PATH.DELETE_USER,
    role: [ROLE.ADMIN]  ,
    middleware: tokenMiddleware.verifyAccessToken.bind(tokenMiddleware),
    handler: usersController.deleteUser.bind(usersController),
  },
];

/**
 * Iterate over the userRoutes array and register each route with the router.
 * The router[method] function is used to register the route with the specified HTTP method and path.
 */
userRoutes.forEach((route) => {
  const { method, path, role = [], middleware = [], handler } = route;
  router[method](path, middleware, roleMiddleware.userRole(...role), handler);
});

export default router;
