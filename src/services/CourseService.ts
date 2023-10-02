import { getRepository, FindOneOptions } from "typeorm";
import { Courses } from "../entity/Course";
import { User } from "../entity/User";

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
      if (!user.course_id) {
        user.course_id = [];
      }

      if (!course.user_id) {
        course.user_id = [];
      }
      // Entity ManyToMany User and Course
      user.course_id.push(course);
      await userRepository.save(user);
      course.user_id.push(user);
      await courseRepository.save(course);

      return true; // Thêm thành công
    } catch (error) {
      console.error(error);
      return false; // Lỗi xử lý
    }
  }
}
