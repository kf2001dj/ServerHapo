import express from "express";
import CourseUserPrController from "../controller/CourseUserPrController";

const courseUserPr = express.Router();

courseUserPr.get(
  "/coursesuser",
  CourseUserPrController.getCourseUserPrController
);

courseUserPr.get(
  "/coursesuser/:id",
  CourseUserPrController.getCoursesUserPrById
);

courseUserPr.get(
  "/coursesuser/list/:userId",
  CourseUserPrController.getCourseUserPrController
);

export default courseUserPr;
