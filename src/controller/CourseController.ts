import { Request, Response } from "express";
import { CoursesService } from "../services/CourseService";

export default class CourseController {
  //code handle  course
  static async getAllCourses(req: Request, res: Response) {
    const courses = await CoursesService.getAllCourses();
    res.json(courses);
  }

  // static async getALlUserToCourse(req: Request, res: Response) {
  //   const usercourse = await CoursesService.getUserToCourse();
  //   res.json(usercourse);
  // }

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
      const { userId, courseId } = req.body;

      if (isNaN(userId) || isNaN(courseId)) {
        return res
          .status(400)
          .json({ message: "Userid không hợp lệ hoặc khóa học" });
      }
      // Gọi hàm service để thêm khoá học cho người dùng
      const result = await CoursesService.handleaddCourseToUser(
        userId,
        courseId
      );
      if (result === true) {
        return res
          .status(200)
          .json({ message: "Khóa học đã được thêm thành công!" });
      } else if (result === false) {
        return res.status(400).json({
          message: "Thêm khóa học không thành công hoặc khóa học đã tồn tại.",
        });
      } else {
        return res.status(500).json({ message: "Lỗi không xác định" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi xử lý token hoặc lỗi xử lý dữ liệu" });
    }
  }

  //code hanndle delete
  static async removeCourseFromUser(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.body;

      if (isNaN(userId) || isNaN(courseId)) {
        return res
          .status(400)
          .json({ message: "Userid không hợp lệ hoặc khóa học" });
      }

      // Gọi hàm service để xoá khóa học khỏi người dùng
      const result = await CoursesService.handleRemoveCourseFromUser(
        userId,
        courseId
      );

      if (result === true) {
        return res
          .status(200)
          .json({ message: "Khóa học đã được xoá thành công!" });
      } else if (result === false) {
        return res.status(400).json({
          message: "Xoá khóa học không thành công hoặc khóa học không tồn tại.",
        });
      } else {
        return res.status(500).json({ message: "Lỗi không xác định" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi xử lý token hoặc lỗi xử lý dữ liệu" });
    }
  }
  static async getUserCourses(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10);

    try {
      if (isNaN(userId) || userId <= 0) {
        throw new Error("Invalid userId");
      }

      const courses = await CoursesService.getUserCourseInfo(userId);

      if (courses.length > 0) {
        res.json(courses);
      } else {
        res
          .status(404)
          .json({ error: "Người dùng không tìm thấy hoặc không có khóa học" });
      }
    } catch (error) {
      console.error("Error fetching user courses:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
