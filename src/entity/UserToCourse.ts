import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { User } from "../entity/User";
import { Courses } from "../entity/Course";

@Entity()
export class UserToCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.course_id)
  user: User;

  @ManyToOne(() => Courses, (course) => course.user_id)
  course: Courses;
}
