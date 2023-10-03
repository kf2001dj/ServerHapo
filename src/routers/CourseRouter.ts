import express from "express";
import CourseController from "../controller/CourseController";
import { authMiddleware } from "../middlewares/authMiddleware";

const courseRouter = express.Router();

courseRouter.get("/courses", CourseController.getAllCourses);

courseRouter.get("/courses/:id", CourseController.getCourseById);

courseRouter.get("/userscourses/:userId", CourseController.getUserCourses);
// courseRouter.get("/user-course/:id", CourseController.getUserToCourseId);

courseRouter.post("/add", authMiddleware, CourseController.addCourseToUser);

// courseRouter.get("/us", CourseController.getAllUserCourses);
export default courseRouter;
