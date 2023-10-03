import { getRepository, FindOneOptions } from "typeorm";
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

  // static async getUserToCourse(): Promise<UserToCourse[]> {
  //   const userCourse = getRepository(UserToCourse);
  //   return await userCourse.find();
  // }

  // static async getUserToCourseId(id: number): Promise<UserToCourse | null> {
  //   const userCourseid = getRepository(UserToCourse);
  //   const options: FindOneOptions<UserToCourse> = {
  //     where: { id },
  //   };
  //   const userCourse = await userCourseid.findOne(options);
  //   return userCourse || null;
  // }

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

  static async getCourseImagesForUser(userId: number) {
    if (isNaN(userId) || userId <= 0) {
      throw new Error("userId không hợp lệ");
    }
    const userToCourseRepository = getRepository(UserToCourse);

    try {
      const courseImages = await userToCourseRepository.find({
        where: { user: { id: userId } },
        select: ["course"], // Replace with the actual column name for course images
      });

      const images = courseImages.map(
        (userToCourse) => userToCourse.course.imageUrl
      );

      return images;
    } catch (error) {
      throw error;
    }
  }
}
