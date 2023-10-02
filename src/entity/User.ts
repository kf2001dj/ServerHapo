import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";

// import { Course_User } from "./Course_user";
import { Courses } from "./Course";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  birthdate: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  about: string;

  @ManyToMany(() => Courses, (course) => course.user_id)
  @JoinTable({
    name: "user_courses", // Tên của bảng liên kết
    joinColumn: {
      name: "user_id", // Tên cột của User
      referencedColumnName: "id", // Tên cột liên kết đến User
    },
    inverseJoinColumn: {
      name: "course_id", // Tên cột của Courses
      referencedColumnName: "id", // Tên cột liên kết đến Courses
    },
  })
  course_id: Courses[];
}
