import { Request, Response } from "express";
import { UserService } from "../services/UserService";
// import jwt, { JsonWebTokenError } from "jsonwebtoken";
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
  //code handle  signin
  // static async signin(req: Request, res: Response) {
  //   const { username, password } = req.body;
  //   if (username && password) {
  //     try {
  //       const token = await UserService.signin(username, password);
  //       if (token) {
  //         res.json({ token });
  //       } else {
  //         res.sendStatus(401);
  //       }
  //     } catch (error) {
  //       res.status(500).json({ message: "Error signing in" });
  //     }
  //   } else {
  //     res.sendStatus(400);
  //   }
  // }
  //code handle sign out
  // static async signout(req: Request, res: Response) {
  //   const userId = req.params.id;
  //   if (!userId) {
  //     res.sendStatus(400);
  //     return;
  //   }

  //   try {
  //     await UserService.signout(Number(userId));
  //     res.sendStatus(200);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error signing out" });
  //   }
  // }

  //code check the status of login
  // static checkLoginStatus(req: Request, res: Response) {
  //   const token = req.headers.authorization
  //     ? req.headers.authorization.split(" ")[1]
  //     : null;
  //   if (token) {
  //     const jwtSecretKey = "your_secret_key";
  //     try {
  //       jwt.verify(token, jwtSecretKey);
  //       res.sendStatus(200);
  //     } catch (err) {
  //       if (err instanceof JsonWebTokenError) {
  //         res.sendStatus(401);
  //       } else {
  //         res.status(500).json({ message: "Error verifying token" });
  //       }
  //     }
  //   } else {
  //     res.sendStatus(401);
  //   }
  // }
  //code decoding token
  // static decodeToken(req: Request, res: Response) {
  //   const token = req.headers.authorization
  //     ? req.headers.authorization.split(" ")[1]
  //     : null;
  //   if (token) {
  //     try {
  //       const decodedToken = jwt.decode(token) as {
  //         username: string;
  //         exp: number;
  //       }; // Ép kiểu dữ liệu
  //       res.json(decodedToken);
  //     } catch (error) {
  //       res.status(500).json({ message: "Error decoding token" });
  //     }
  //   } else {
  //     res.status(401).json({ message: "Token not provided" });
  //   }
  // }
}
