import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

// Middleware xử lý xác thực và xử lý CORS (Cross-Origin Resource Sharing)
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Cài đặt các tiêu đề CORS để cho phép các yêu cầu từ nguồn cụ thể
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Tiếp tục đến middleware hoặc xử lý route tiếp theo
  next();

  // Xử lý các yêu cầu CORS trước (phương thức OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Trích xuất mã thông báo xác thực từ tiêu đề yêu cầu
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  // Xác thực mã thông báo để đảm bảo tính xác thực
  if (token) {
    try {
      const isLoggedIn = await UserService.verifyToken(token);
      // Nếu mã thông báo hợp lệ, cho phép yêu cầu tiếp tục
      if (isLoggedIn) {
        next();
        return;
      } else {
        // Nếu mã thông báo không hợp lệ, gửi phản hồi 401 Unauthorized
        res.sendStatus(401);
        return;
      }
    } catch (error) {
      // Ghi log và xử lý lỗi nếu có trong quá trình xác thực mã thông báo
      console.error(error);
      res.sendStatus(500);
      return;
    }
  } else {
    // Nếu không có mã thông báo, gửi phản hồi 401 Unauthorized
    res.sendStatus(401);
    return;
  }
}
