import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (token) {
    try {
      const isLoggedIn = await UserService.verifyToken(token);
      if (isLoggedIn) {
        next();
        return;
      } else {
        res.sendStatus(401);
        return;
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }
  } else {
    res.sendStatus(401);
    return;
  }
}
