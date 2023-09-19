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

  @ManyToMany(() => User)
  user_id: User[];
}
