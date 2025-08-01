import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy phần sau 'Bearer'

  if (!token) {
    return res.status(401).json({ error: "Không có token, truy cập bị từ chối." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Thêm thông tin người dùng vào request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
  }
};
