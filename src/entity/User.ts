// src/entities/User.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
}

// src/entities/Course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txtname: string;

  @Column()
  image_url: string;
}

// src/entities/CourseUser.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.entity";
import { Course } from "./Course.entity";

@Entity()
export class CourseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.courseUsers)
  user: User;

  @ManyToOne(() => Course, (course) => course.courseUsers)
  course: Course;
}
