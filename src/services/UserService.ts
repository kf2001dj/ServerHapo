import { getRepository, FindOneOptions, Repository } from "typeorm";
import { User } from "../entity/User";

import * as jwt from "jsonwebtoken"; // Import thư viện jwt để tạo token

import * as bcrypt from "bcrypt"; // Import thư viện bcrypt để băm mật khẩu

const jwtSecretKey = "your_secret_key";

export class UserService {
  //handle tabble user
  static async getAllUsers() {
    const userRepository = getRepository(User); // Lấy repository cho đối tượng User từ TypeORM
    return userRepository.find(); // Sử dụng phương thức find() để lấy danh sách tất cả người dùng
  }

  //handle tabble user:id
  static async getUsersById(id: number): Promise<User | null> {
    const usersRepository = getRepository(User);

    const options: FindOneOptions<User> = {
      where: { id },
    };

    const users = await usersRepository.findOne(options);
    return users || null; //trả về người dùng là null hoặc không tìm thấy
  }

  //code handle sign in
  static async signIn(
    username: string,
    password: string
  ): Promise<string | null> {
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { username } }); //Tìm người dùng thep username

      if (user) {
        // Nếu người dùng tồn tại
        const passwordMatch = await bcrypt.compare(password, user.password); // So sánh mật khẩu đã nhập với mật khẩu trong cơ sở dữ liệu mysql

        if (passwordMatch) {
          // Nếu mật khẩu khớp
          const token = jwt.sign({ username }, jwtSecretKey, {
            expiresIn: "7d", //accset token 1 phút , 7d 7 ngày refreshToken,hoặc 1h
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

  // Băm mật khẩu
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; //số vòng sử dụng khi băm mật khẩu
    return bcrypt.hash(password, saltRounds); // Băm mật khẩu với số vòng và trả về mật khẩu đã băm
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
        // const newToken = jwt.sign(
        //   { sub: decodedToken.payload.sub },
        //   jwtSecretKey,
        //   { expiresIn: "1" }
        // );
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

  //code handle update profile

  static async updateUser(userId: string, userData: any): Promise<User | null> {
    const userRepository = getRepository(User);
    console.log("2");
    try {
      const userIdnumber = parseInt(userId, 10);
      // Sử dụng find để tìm tất cả người dùng có id tương ứng (nên chỉ có 1 hoặc không có)
      const user = await userRepository.findOne({
        where: { id: userIdnumber },
      });

      if (user) {
        // Cập nhật thông tin người dùng từ User (nếu có)
        user.name = userData.name || user.name;
        user.email = userData.email || user.email;
        user.birthdate = userData.birthdate || user.birthdate;
        user.phone = userData.phone || user.phone;
        user.address = userData.address || user.address;
        user.about = userData.about || user.about;
        // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
        const updatedUser = await userRepository.save(user);
        // Trả về thông tin người dùng đã cập nhật

        return updatedUser;
      } else {
        // Nếu không tìm thấy người dùng, trả về null
        return null;
      }
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình cập nhật, ném lỗi ra ngoài để xử lý ở phía controller
      throw error;
    }
  }
}
