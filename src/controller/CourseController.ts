import { Request, Response } from "express";
import { CoursesService } from "../services/CourseService";

export default class CourseController {
  //code handle  course
  static async getAllCourses(req: Request, res: Response) {
    const courses = await CoursesService.getAllCourses();
    res.json(courses);
  }

  static async getCourseById(req: Request, res: Response) {
    const courseId = parseInt(req.params.id, 10);

    const course = await CoursesService.getCourseById(courseId);

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
}
