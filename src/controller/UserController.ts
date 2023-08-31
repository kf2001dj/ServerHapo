import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export default class UserController {
  //code handle  id
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  //code handle  userid
  static async getUsersById(req: Request, res: Response) {
    const usersId = parseInt(req.params.id, 10);

    const users = await UserService.getUsersById(usersId);

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }

  //code handle  signin and status
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
    const { username } = req.body;
    if (username) {
      try {
        await UserService.logout(username);
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(400);
    }
  }

  //code handle sign up user
  static async signUp(req: Request, res: Response) {
    // async lưu trữ không đồng
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
}
