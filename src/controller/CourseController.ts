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

  //code handle course userid
  static async addCourseToUser(req: Request, res: Response) {
    try {
      // Lấy userId và courseId từ request hoặc params
      const userId = req.body.userId || req.params.userId;
      const courseId = req.body.courseId || req.params.courseId;

      // Gọi hàm service để thêm khoá học cho người dùng
      const result = await CoursesService.handleaddCourseToUser(
        userId,
        courseId
      );

      if (result) {
        return res.status(200).json({ message: "Thêm khoá học thành công" });
      } else {
        return res.status(400).json({ message: "Thêm khoá học thất bại" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi xử lý token hoặc lỗi xử lý dữ liệu" });
    }
  }
}
