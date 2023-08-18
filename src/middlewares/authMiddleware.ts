import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (token) {
    try {
      const isLoggedIn = await UserService.verifyToken(token);
      if (isLoggedIn) {
        next();
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
