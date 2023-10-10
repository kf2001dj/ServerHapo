import express from "express";
import CourseController from "../controller/CourseController";
// import { authMiddleware } from "../middlewares/authMiddleware";

const courseRouter = express.Router();

courseRouter.get("/courses", CourseController.getAllCourses);

courseRouter.get("/courses/:id", CourseController.getCourseById);

courseRouter.post("/add", CourseController.addCourseToUser);
courseRouter.post("/delete", CourseController.removeCourseFromUser);

courseRouter.get("/userscourses/:userId", CourseController.getUserCourses);

export default courseRouter;
