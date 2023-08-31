import { getRepository, FindOneOptions, Repository } from "typeorm";
import { User } from "../entity/User";

import * as jwt from "jsonwebtoken";

import * as bcrypt from "bcrypt";

const jwtSecretKey = "your_secret_key";

export class UserService {
  //handle tabble user
  static async getAllUsers() {
    const userRepository = getRepository(User);
    return userRepository.find();
  }

  //handle tabble user:id
  static async getUsersById(id: number): Promise<User | null> {
    const usersRepository = getRepository(User);

    const options: FindOneOptions<User> = {
      where: { id },
    };

    const users = await usersRepository.findOne(options);
    return users || null;
  }

  //code handle sign in
  static async signIn(
    username: string,
    password: string
  ): Promise<string | null> {
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { username } });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const token = jwt.sign({ username }, jwtSecretKey, {
            expiresIn: "1h",
          });
          return token;
        } else {
          return null; // Mật khẩu không khớp
        }
      } else {
        return null; // Người dùng không tồn tại
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  //code handle sign up
  static async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const userRepository = getRepository(User);

    try {
      const existingUser = await userRepository.findOne({
        where: [{ username }, { email }],
      });
      if (existingUser) {
        return false; // người dùng đã tồn tại
      }

      const hashedPassword = await bcrypt.hash(password, 10); //mã hoá mật khẩu
      const newUser = userRepository.create({
        username,
        email,
        password: hashedPassword,
      });
      await userRepository.save(newUser);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  //code handle status sigin
  static async verifyToken(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  //code handle sign out
  static async logout(username: string): Promise<void> {
    try {
      const userRepository = getRepository(User);
      const searchOptions: FindOneOptions<User> = { where: { username } };
      const user = await userRepository.findOne(searchOptions);

      if (user) {
      }
    } catch (error) {
      throw new Error("Error while logging out");
    }
  }
}
