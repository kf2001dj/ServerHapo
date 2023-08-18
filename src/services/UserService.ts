import { getRepository, FindOneOptions, Repository } from "typeorm";
import { User } from "../entity/User";

import * as jwt from "jsonwebtoken";

const jwtSecretKey = "your_secret_key";

export class UserService {
  static async getAllUsers() {
    const userRepository = getRepository(User);
    return userRepository.find();
  }

  static async getUserById(userId: string) {
    const userRepository = getRepository(User);
    return userRepository.findOne({ id: userId } as FindOneOptions<User>);
  }

  //code handle sign in
  static async signIn(
    username: string,
    password: string
  ): Promise<string | null> {
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOne({
        where: { username, password },
      });

      if (user) {
        const token = jwt.sign({ username }, jwtSecretKey, {
          expiresIn: "1h",
        });
        return token;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
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
