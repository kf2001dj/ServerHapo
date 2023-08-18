import express from "express";
import CourseController from "../controller/CourseController";

const courseRouter = express.Router();

courseRouter.get("/courses", CourseController.getAllCourses);

courseRouter.get("/courses/:id", CourseController.getCourseById);

export default courseRouter;
