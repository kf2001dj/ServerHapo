import express from "express";
import UserController from "../controller/UserController";

import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = express.Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:id", UserController.getUserById);

userRouter.post("/signin", UserController.signIn);

userRouter.use(authMiddleware);
userRouter.get("/signin/status", UserController.checkLoginStatus);
userRouter.get("/protected", (req, res) => {
  res.send("This is a protected route.");
});

userRouter.post("/signout", UserController.signOut);

export default userRouter;
