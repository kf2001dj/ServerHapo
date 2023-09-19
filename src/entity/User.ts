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

  @ManyToMany(() => Courses)
  @JoinTable()
  course_id: Courses[];
}
