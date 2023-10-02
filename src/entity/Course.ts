import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";
// import { Course_User } from "./Course_user";
@Entity()
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  name: string;

  @Column()
  about: string;

  @Column()
  learners: string;

  @Column()
  lessons: string;

  @Column()
  time: string;

  @Column()
  txtname: string;

  @Column()
  logo: string;

  @ManyToMany(() => User, (user) => user.course_id)
  @JoinTable({
    name: "user_courses", // Tên của bảng liên kết (cần phải trùng với tên trong User Entity)
    joinColumn: {
      name: "course_id", // Tên cột của Courses
      referencedColumnName: "id", // Tên cột liên kết đến Courses
    },
    inverseJoinColumn: {
      name: "user_id", // Tên cột của User
      referencedColumnName: "id", // Tên cột liên kết đến User
    },
  })
  user_id: User[];
}
