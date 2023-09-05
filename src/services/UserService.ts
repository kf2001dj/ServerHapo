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
    const saltRounds = 10; //số vòng sử dụng khi băm mật khẩu
    return bcrypt.hash(password, saltRounds);
  }

  //code handle sign up
  static async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const userRepository = getRepository(User); //sử dụng thư viên lấy kho dữ liệu

    try {
      // Kiểm tra xem có người dùng nào đã sử dụng username hoặc email này chưa đã
      const existingUser = await userRepository.findOne({
        where: [{ username }, { email }],
      });
      if (existingUser) {
        return false; // người dùng đã tồn tại,trả về false
      }
      // Mã hoá mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(password, 10); //mã hoá mật khẩu
      // Tạo một đối tượng người dùng mới
      const newUser = userRepository.create({
        username,
        email,
        password: hashedPassword, // Sử dụng mật khẩu đã được mã hoá là biến bên trên
      });
      // Lưu đối tượng người dùng mới vào cơ sở dữ liệu
      await userRepository.save(newUser);
      return true; // Trả về true để chỉ ra rằng người dùng đã được tạo thành công
    } catch (error) {
      console.error(error);
      return false; // Trả về false nếu có lỗi trong quá trình tạo người dùng
    }
  }

  //code handle status sigin
  static async verifyToken(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Sử dụng jwt.verify để kiểm tra tính hợp lệ của token
      jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
          // Nếu có lỗi trong quá trình xác thực, reject với giá trị false
          reject(false);
        } else {
          // Nếu token hợp lệ và không có lỗi, resolve với giá trị true
          resolve(true);
        }
      });
    });
  }

  // Hàm này xử lý đăng xuất bằng cách cấu hình thời gian sống (expiration time) ngắn hơn
  static async logOut(token: string): Promise<boolean> {
    try {
      // Decode token để kiểm tra tính hợp lệ của token
      const isLoggedIn = await UserService.verifyToken(token);

      if (isLoggedIn) {
        // Nếu người dùng đã đăng nhập, thì mới cho phép xuất userId
        // Decode token để lấy thông tin payload (chẳng hạn user ID)
        const decodedToken: any = jwt.decode(token, { complete: true });

        // Tạo một token mới với thời gian sống rất ngắn, ví dụ: 1 giây
        const newToken = jwt.sign(
          { sub: decodedToken.payload.sub },
          jwtSecretKey,
          { expiresIn: "1" }
        );
        // Trả về token mới (đã hết hạn), người dùng sẽ không thể sử dụng nó
        return Promise.resolve(true);
      } else {
        // Nếu không đăng nhập, không xuất userId
        return Promise.resolve(false);
      }
    } catch (error) {
      return Promise.reject(error); // Xảy ra lỗi, reject với lỗi
    }
  }
}
