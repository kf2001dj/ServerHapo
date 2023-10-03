import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => User, (user) => user.course_id)
  @JoinTable()
  user_id: User[];
}
