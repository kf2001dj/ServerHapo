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

@Entity({ name: "courses_users" })
export class Courses_User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courses_id: string;

  @Column()
  user_id: string;
}
