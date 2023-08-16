import { getRepository, FindOneOptions, Repository } from "typeorm";
import { User } from "../entity/User";

export class UserService {
  static async getAllUsers() {
    const userRepository = getRepository(User);
    return userRepository.find();
  }

  static async getUserById(userId: string) {
    const userRepository = getRepository(User);
    return userRepository.findOne({ id: userId } as FindOneOptions<User>);
  }

  // private static userRepository: Repository<User> = getRepository(User);
  // static async signin(
  //   username: string,
  //   password: string
  // ): Promise<string | null> {
  //   const user = await this.userRepository.findOne({
  //     where: { username, password },
  //   });

  //   if (user) {
  //     const token = "generate_your_token_here";
  //     return token;
  //   } else {
  //     return null;
  //   }
  // }

  //   static async signout(userId: string): Promise<void> {
  //     try {
  //       const user = await this.userRepository.findOneOrFail(userId);
  //       user.isLoggedIn = false;
  //       await this.userRepository.save(user);
  //     } catch (error) {
  //       throw new Error("User not found");
  //     }
  //   }
}
