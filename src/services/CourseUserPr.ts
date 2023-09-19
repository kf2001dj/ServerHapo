import { FindOneOptions, getRepository } from "typeorm";
import { Course_User } from "../entity/Course_user";
import { Request, Response } from "express-serve-static-core";

import { Courses } from "../entity/Course";

export class CourseUserPr {
  static async getCourseUser(): Promise<Course_User[]> {
    const CourseUserRepository = getRepository(Course_User);
    return await CourseUserRepository.find();
  }

  static async getCourseUserPrById(id: number): Promise<Course_User | null> {
    const CourseUserRepository = getRepository(Course_User);

    const options: FindOneOptions<Course_User> = {
      where: { id },
    };

    const course = await CourseUserRepository.findOne(options);
    return course || null;
  }

  // CODE HANDEL profile courses
  static async getCoursesForUser(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" });
    }

    try {
      const courseUserRepository = getRepository(Course_User);

      const courseUserEntries = await courseUserRepository.find({
        where: { user_id: userId }, // Sử dụng userId thay vì ép kiểu req.params
        relations: ["courses"],
      });

      const courses = courseUserEntries.map((entry) => {
        const course = entry.course as Courses; // Ép kiểu entry.course thành kiểu Course
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
