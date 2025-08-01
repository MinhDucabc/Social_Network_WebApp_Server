import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy phần sau 'Bearer'

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "Không có token, truy cập bị từ chối." });
  }

  // Kiểm tra JWT_SECRET có tồn tại không
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userAuthId = decoded.authId; // Thêm thông tin người dùng vào request
    console.log("✅ Token verified successfully for user:", decoded.authId);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: "Token đã hết hạn." });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: "Token không hợp lệ." });
    } else {
      return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    }
  }
};
