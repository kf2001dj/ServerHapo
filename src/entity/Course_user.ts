import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";

import { User } from "./User";
import { Courses } from "./Course";

@Entity({ name: "courses_users" })
export class Course_User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  course_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Courses, (course) => course.id)
  @JoinColumn({ name: "course_id" })
  course: Courses;
}
