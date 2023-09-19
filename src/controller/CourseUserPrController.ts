import { Request, Response } from "express";
import { CourseUserPr } from "../services/CourseUserPr";
import { Courses } from "../entity/Course";
import { getRepository } from "typeorm";

export default class CourseUserPrController {
  static async getCourseUserPrController(req: Request, res: Response) {
    const coursesUserPr = await CourseUserPr.getCourseUser();
    res.json(coursesUserPr);
  }

  //code handle by userId
  static async getCoursesUserPrById(req: Request, res: Response) {
    const courseUserPrId = parseInt(req.params.id, 10);

    const courseUserPr = await CourseUserPr.getCourseUserPrById(courseUserPrId);
    if (courseUserPr) {
      res.status(200).json(courseUserPr);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }

  //CODE HANDLE COURSE_USER
  static async getCoursesForUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "userId không hợp lệ" });
      }

      const courseUserRepository = getRepository(CourseUserPr);

      const courseUserEntries = await courseUserRepository.find({
        where: { user_id: id as any },
        relations: ["courses"],
      });

      const courses = courseUserEntries.map((entry) => {
        const course = entry as Courses; // Ép kiểu entry.course thành kiểu Course
        return {
          txtname: course.txtname, // txtname trong Course
          imageUrl: course.imageUrl, // imageUrl trong Course
        };
      });

      return res.status(200).json(courses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
  }
}
