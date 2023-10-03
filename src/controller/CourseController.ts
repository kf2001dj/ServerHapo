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

  // static async getUserToCourseId(req: Request, res: Response) {
  //   const usercourseId = parseInt(req.params.id, 10);

  //   const course = await CoursesService.getUserToCourseId(usercourseId);

  //   if (course) {
  //     res.status(200).json(course);
  //   } else {
  //     res.status(404).json({ message: "UserCourse not found" });
  //   }
  // }
  //code handle course userid
  static async addCourseToUser(req: Request, res: Response) {
    try {
      // Lấy userId và courseId từ request hoặc params
      // const userId = Number(req.body.userId || req.params.userId);
      // const courseId = Number(req.body.courseId || req.params.courseId);
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

      if (result) {
        return res.status(200);
      } else {
        return res.status(400);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Lỗi xử lý token hoặc lỗi xử lý dữ liệu" });
    }
  }

  static async getUserCourses(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10); // Parse the userId from the URL parameter

    try {
      if (isNaN(userId) || userId <= 0) {
        // Check for invalid userId
        throw new Error("Invalid userId");
      }
      const courses = await CoursesService.getCourseImagesForUser(userId);

      if (courses.length > 0) {
        res.json(courses);
      } else {
        res.status(404).json({ error: "User not found or has no courses" });
      }
    } catch (error) {
      console.error("Error fetching user courses:", error.message);
      res.status(400).json({ error: error.message });
    }
  }
}
