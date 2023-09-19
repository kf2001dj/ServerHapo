import { Request, Response } from "express";
import { UserService } from "../services/UserService";
// import { User } from "src/entity/User";
// import { getRepository } from "typeorm";

export default class UserController {
  //code handle id
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  //code handle userid
  static async getUsersById(req: Request, res: Response) {
    const usersId = parseInt(req.params.id, 10);

    const users = await UserService.getUsersById(usersId);

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }

  //code handle signin and status
  static async signIn(req: Request, res: Response) {
    const { username, password } = req.body;

    if (username && password) {
      try {
        const token = await UserService.signIn(username, password);

        if (token) {
          res.json({ token });
        } else {
          res.sendStatus(401);
        }
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  static async checkLoginStatus(req: Request, res: Response) {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (token) {
      try {
        const isLoggedIn = await UserService.verifyToken(token);
        if (isLoggedIn) {
          res.sendStatus(200);
        } else {
          res.sendStatus(401);
        }
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(401);
    }
  }

  //code handle sign out
  static async signOut(req: Request, res: Response) {
    // Trích xuất token từ tiêu đề "authorization" của request
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    // Kiểm tra xem có token trong request không
    if (token) {
      try {
        // Kiểm tra xem token này có hợp lệ không bằng cách gọi hàm verifyToken từ UserService
        const isLoggedIn = await UserService.verifyToken(token);

        // Nếu token hợp lệ (người dùng đã đăng nhập)
        if (isLoggedIn) {
          // Thực hiện đăng xuất bằng cách gọi hàm logOut từ UserService
          await UserService.logOut(token);

          // Trả về mã trạng thái 200 OK để cho biết đăng xuất đã thành công
          res.sendStatus(200);
        } else {
          // Nếu token không hợp lệ (người dùng chưa đăng nhập), trả về mã trạng thái 401 Unauthorized
          res.sendStatus(401);
        }
      } catch (error) {
        // Xử lý lỗi nếu có lỗi xảy ra trong quá trình đăng xuất hoặc kiểm tra token
        console.error(error);

        // Trả về mã trạng thái 500 Internal Server Error để cho biết có sự cố xảy ra
        res.sendStatus(500);
      }
    } else {
      // Nếu không có token trong request, trả về mã trạng thái 401 Unauthorized
      res.sendStatus(401);
    }
  }

  //code handle sign up user
  static async signUp(req: Request, res: Response) {
    const { username, email, password, confirmPassword } = req.body;

    if (username && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu xác nhận không khớp" });
      }

      try {
        const result = await UserService.createUser(username, email, password);
        if (result) {
          return res.sendStatus(201);
        } else {
          return res.sendStatus(500);
        }
      } catch (error) {
        console.error(error);
        return res.sendStatus(500);
      }
    } else {
      return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
    }
  }
  
  //code handle update profile userid
  static async updateProfile(req: Request, res: Response) {
    const userId = req.params.id;
    const userData = req.body;
    try {
      const updateProfile = await UserService.updateUser(userId, userData);
      if (updateProfile) {
        res.json({ message: "Cập nhật profile thành công !!!" });
      } else {
        res.status(404).json({ message: "Người dùng không tìm thấy ???" });
      }
    } catch (error) {
      console.error("Lỗi cập nhật dữ liệu người dùng", error);
      res.status(500).json({ error: "Lỗi cập nhật dữ liệu người dùng" });
    }
  }

}
