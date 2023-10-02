import express from "express";
import CourseController from "../controller/CourseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const courseRouter = express.Router();

courseRouter.get("/courses", CourseController.getAllCourses);

courseRouter.get("/courses/:id", CourseController.getCourseById);

courseRouter.post("/hapo", authMiddleware, CourseController.addCourseToUser);

export default courseRouter;
