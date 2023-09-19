import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Course_User } from "./Course_user";
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

  @Column()
  logo_learners: string;

  @Column()
  logo_lessons: string;

  @Column()
  logo_times: string;

  @Column()
  logo_tags: string;

  @Column()
  logo_price: string;

  @Column()
  logo_searc: string;

  @Column()
  logo_left: string;

  @Column()
  logo_right: string;

  @ManyToMany(() => Course_User, (courseUser) => courseUser.course_id)
  course: Course_User[];
}
