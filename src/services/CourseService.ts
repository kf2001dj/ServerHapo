import { getRepository, FindOneOptions, Repository } from "typeorm";
import { Courses } from "../entity/Course";

export class CoursesService {
  static async getAllCourses(): Promise<Courses[]> {
    const courseRepository = getRepository(Courses);
    return await courseRepository.find();
  }

  static async getCourseById(id: number): Promise<Courses | null> {
    const courseRepository = getRepository(Courses);

    // Sử dụng đối tượng FindOneOptions để truyền tham số
    const options: FindOneOptions<Courses> = {
      where: { id },
    };

    const course = await courseRepository.findOne(options);
    return course || null;
  }
}
