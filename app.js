const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// Cấu hình phiên
app.use(
  session({
    secret: 'secret_key', // Khóa bí mật để ký và mã hóa phiên
    resave: true, // lưu lại phiên nếu không có sự thay đổi
    saveUninitialized: true, // lưu lại phiên chưa được khởi tạo
  })
);

// Kết nối tới cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hapo',
});

// Kết nối MySQL
db.connect((error) => {
  if (error) {
    console.error('Lỗi kết nối MySQL: ', error);
  } else {
    console.log('Kết nối MySQL thành công!');
  }
});

// Sử dụng body-parser để xử lý dữ liệu POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET: Lấy danh sách người dùng -> Create
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Lấy thông tin user theo ID -> Create
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Đăng nhập
app.post('/api/signin', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;
          res.sendStatus(200);
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
app.post('/api/signout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

// Kiểm tra trạng thái đăng nhập
app.get('/api/signin/status', (req, res) => {
  if (req.session.loggedin) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// Đăng ký
app.post('/api/signup', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (username && email && password && confirmPassword) {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        return res.status(400).json({ message: 'Người dùng đã tồn tại' });
      }

      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (error) => {
        if (error) throw error;
        return res.sendStatus(201);
      });
    });
  } else {
    res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
  }
});



// Khởi chạy server
app.listen(4000, () => {
  console.log('Server đang lắng nghe trên cổng 4000...');
});


// API thêm dữ liệu hình ảnh vào cơ sở dữ liệu
app.post('/api/users', (req, res) => {
  const { image_url } = req.body; // Đường dẫn hình ảnh được gửi từ frontend
  if (!image_url) {
    res.status(400).json({ error: 'Đường dẫn hình ảnh không được để trống.' });
    return;
  }
  const query = `INSERT INTO profile (image_path) VALUES ('${image_url}')`;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Lỗi truy vấn cơ sở dữ liệu: ', err);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu.' });
      return;
    }
    res.json({ message: 'Lưu đường dẫn hình ảnh thành công.' });
  });
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  db.query('UPDATE users SET name=?, email=?, birthdate=?, phone=?, address=?, about=? WHERE id = ?', 
    [userData.name, userData.email, userData.birthdate, userData.phone, userData.address, userData.about, userId],
    (err, results) => {
      if (err) {
        console.error('Error updating user data: ', err);
        res.status(500).json({ error: 'Error updating user data' });
        return;
      }
      res.json({ message: 'User data updated successfully' });
    });
});



// Định nghĩa API để lấy danh sách các khóa học
app.get('/api/course', (req, res) => {
  const sql = 'SELECT * FROM course';
  db.query(sql, (err, courses) => {
    if (err) {
      throw err;
    }
    // Trả về danh sách các khóa học
    res.json(courses);
  });
});
