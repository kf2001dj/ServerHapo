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
  static async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const user = await UserService.getUserById(userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
  // static async signOut(req: Request, res: Response) {
  //   const { username } = req.body;
  //   if (username) {
  //     try {
  //       await UserService.logout(username);
  //       res.sendStatus(200);
  //     } catch (error) {
  //       console.error(error);
  //       res.sendStatus(500);
  //     }
  //   } else {
  //     res.sendStatus(400);
  //   }
  // }


  
}
