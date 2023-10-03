import { getRepository, FindOneOptions, Repository } from "typeorm";
import { Courses } from "../entity/Course";
import { User } from "../entity/User";

import { UserToCourse } from "../entity/UserToCourse";

export class CoursesService {
  static async getAllCourses(): Promise<Courses[]> {
    const courseRepository = getRepository(Courses);
    return await courseRepository.find();
  }

  static async getCourseById(id: number): Promise<Courses | null> {
    const courseRepository = getRepository(Courses);

    const options: FindOneOptions<Courses> = {
      where: { id },
    };

    const course = await courseRepository.findOne(options);
    return course || null;
  }

  //code handle add course id user id
  static async handleaddCourseToUser(
    userId: number,
    courseId: number
  ): Promise<boolean> {
    const userRepository = getRepository(User);
    const courseRepository = getRepository(Courses);

    try {
      const user = await userRepository.findOne({ where: { id: userId } });
      const course = await courseRepository.findOne({
        where: { id: courseId },
      });

      if (!user || !course) {
        return false; // Thêm khoá học thất bại nếu không tìm thấy userId và courseId
      }

      const userCourse = new UserToCourse();
      userCourse.user = user;
      userCourse.course = course;

      // Save the UserCourse entry
      await getRepository(UserToCourse).save(userCourse);

      return true; // Thêm thành công
    } catch (error) {
      console.error(error);
      return false; // Lỗi xử lý
    }
  }

  static async getUserCourseInfo(userId: number) {
    try {
      const userToCourseRepository: Repository<UserToCourse> =
        getRepository(UserToCourse);

      const result = await userToCourseRepository
        .createQueryBuilder("UserToCourse")
        .select([
          "UserToCourse.id",
          "course_id.id as id",
          "course_id.imageUrl as imageUrl",
          "course_id.txtname as txtname",
        ])
        .leftJoin("UserToCourse.user", "user_id")
        .leftJoin("UserToCourse.course", "course_id")
        .where("user_id.id = :userId", { userId })
        .getRawMany();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
