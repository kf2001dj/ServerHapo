import express from "express";
import UserController from "../controller/UserController";

import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = express.Router();

userRouter.get("/users", UserController.getAllUsers);
userRouter.get("/users/:id", UserController.getUsersById);

userRouter.post("/signin", UserController.signIn);

userRouter.get(
  "/signin/status",
  authMiddleware,
  UserController.checkLoginStatus
);

userRouter.post("/signout", authMiddleware, UserController.signOut);
userRouter.post("/up", UserController.signUp);

export default userRouter;
