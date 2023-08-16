import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "image_url" })
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
}

@Entity({ name: "courses" })
export class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "image_url" })
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
}

@Entity({ name: "courses_users" })
export class Courses_User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courses_id: string;

  @Column()
  user_id: string;
}
