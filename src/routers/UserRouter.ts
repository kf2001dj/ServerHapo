import express from "express";
import UserController from "../controller/UserController";

const userRouter = express.Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:id", UserController.getUserById);

// // userRouter.post("/signin", UserController.signin);
// // userRouter.post("/signout", UserController.signout);
// // userRouter.get("/signin/status", UserController.checkLoginStatus);
// // userRouter.get("/token/decode", UserController.decodeToken);

export default userRouter;
