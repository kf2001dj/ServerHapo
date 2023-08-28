const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// Cấu hình phiên
app.use(
  session({
    secret: "secret_key", // Khóa bí mật để ký và mã hóa phiên
    resave: true, // lưu lại phiên nếu không có sự thay đổi
    saveUninitialized: true, // lưu lại phiên chưa được khởi tạo
  })
);
// Kết nối tới cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hapo",
});
// Kết nối MySQL
db.connect((error) => {
  if (error) {
    console.error("Lỗi kết nối MySQL: ", error);
  } else {
    console.log("Kết nối MySQL thành công!");
  }
});
// GET: Lấy danh sách người dùng -> Create
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Lấy thông tin user theo ID -> Create
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Sử dụng body-parser để xử lý dữ liệu POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// JWT secret key (you should use a strong and unique secret key)
const jwtSecretKey = "your_secret_key";

// Đăng nhập và cấp JWT token
app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          // Generate and sign a JWT token
          const token = jwt.sign({ username }, jwtSecretKey, {
            expiresIn: "1h",
          });

          // Send the token in the response
          res.json({ token });
        } else {
          res.sendStatus(401);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
});

// Đăng xuất
app.post("/api/signout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

// Kiểm tra trạng thái đăng nhập (protected route)
app.get("/api/signin/status", (req, res) => {
  // Verify the JWT token from the Authorization header
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        // Invalid token or token expired
        res.sendStatus(401);
      } else {
        // Token is valid, the user is logged in
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(401);
  }
});
////////////////////////////////////////////////////////////////////////////////////////
// Đăng ký
app.post("/api/signup", (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (username && email && password && confirmPassword) {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }

    db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
          return res.status(400).json({ message: "Người dùng đã tồn tại" });
        }

        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, password],
          (error) => {
            if (error) throw error;
            return res.sendStatus(201);
          }
        );
      }
    );
  } else {
    res.status(400).json({ message: "Yêu cầu không hợp lệ" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Khởi chạy server
app.listen(4000, () => {
  console.log("Server đang lắng nghe trên cổng 4000...");
});

// API thêm dữ liệu hình ảnh vào cơ sở dữ liệu
app.post("/api/users", (req, res) => {
  const { image_url } = req.body; // Đường dẫn hình ảnh được gửi từ frontend
  if (!image_url) {
    res.status(400).json({ error: "Đường dẫn hình ảnh không được để trống." });
    return;
  }
  const query = `INSERT INTO profile (image_path) VALUES ('${image_url}')`;
  db.query(query, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu: ", err);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu." });
      return;
    }
    res.json({ message: "Lưu đường dẫn hình ảnh thành công." });
  });
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  db.query(
    "UPDATE users SET name=?, email=?, birthdate=?, phone=?, address=?, about=? WHERE id = ?",
    [
      userData.name,
      userData.email,
      userData.birthdate,
      userData.phone,
      userData.address,
      userData.about,
      userId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating user data: ", err);
        res.status(500).json({ error: "Error updating user data" });
        return;
      }
      res.json({ message: "User data updated successfully" });
    }
  );
});

// API to get courses for a specific user
app.get("/api/users/:id/courses", (req, res) => {
  const userId = req.params.id;
  const sql =
    "SELECT cu.id, cu.course_id, c.txtname, c.image_url FROM courses_users cu JOIN courses c ON cu.course_id = c.id WHERE cu.user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching courses for user:", err);
      res.status(500).json({ error: "Failed to fetch courses for user" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Định nghĩa API để lấy danh sách các khóa học ||phần all course
app.get("/api/courses", (req, res) => {
  const sql = "SELECT * FROM courses";
  db.query(sql, (err, courses) => {
    if (err) {
      throw err;
    }
    // Trả về danh sách các khóa học
    res.json(courses);
  });
});

// API to get course information by ID
app.get("/api/courses/:id", (req, res) => {
  const courseId = req.params.id;
  const sql = "SELECT * FROM courses WHERE id = ?";
  db.query(sql, [courseId], (err, results) => {
    if (err) {
      console.error("Error fetching course data:", err);
      res.status(500).json({ error: "Failed to fetch course data" });
    } else {
      if (results.length === 0) {
        // Course with the specified ID not found
        res.status(404).json({ message: "Course not found" });
      } else {
        // Course data found, return it to the client
        res.status(200).json(results[0]);
      }
    }
  });
});

app.get("/api/courses_users", (req, res) => {
  const sql = "SELECT * FROM courses_users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching courses_users:", err);
      res.status(500).json({ error: "Failed to fetch courses_users" });
    } else {
      // Fetch the course information for each entry in courses_users
      const coursePromises = results.map((courseUser) => {
        return new Promise((resolve, reject) => {
          const getCourseSql = "SELECT * FROM courses WHERE id = ?";
          db.query(
            getCourseSql,
            [courseUser.course_id],
            (err, courseResults) => {
              if (err) {
                console.error("Error fetching course:", err);
                reject(err);
              } else {
                resolve({ ...courseUser, course: courseResults[0] });
              }
            }
          );
        });
      });
      // Resolve all promises and return the data
      Promise.all(coursePromises)
        .then((courseData) => {
          res.status(200).json(courseData);
        })
        .catch((err) => {
          console.error("Error fetching course data:", err);
          res.status(500).json({ error: "Failed to fetch course data" });
        });
    }
  });
});

app.post("/api/addCourseToUser", (req, res) => {
  const { userId } = req.body;
  const { course_id } = req.params;
  //xác thực đăng nhập
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (token) {
    jwt.verify(token, jwtSecretKey, async (err, decoded) => {
      if (err) {
        // Invalid token or token expired
        res.sendStatus(401);
      } else {
        // Token is valid, the user is logged in
        const query =
          "INSERT INTO courses_users (user_id, course_id) VALUES (?, ?)";

        db.query(query, [userId, course_id], (error, results) => {
          if (error) {
            console.error("Error adding course to user:", error);
            res.status(500).json({ error: "An error occurred" });
          } else {
            res
              .status(201)
              .json({ message: "Course added to user successfully" });
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});
