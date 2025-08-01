import User from "../../models/user.js";

export const getUnfollowedUsers = async (req, res) => {
  try {
    const { userId } = req.body;

    // Tìm user hiện tại
    const currentUser = await User.findOne({ id: userId });
    if (!currentUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Tìm tất cả người dùng không nằm trong danh sách following và không phải chính mình
    const users = await User.find({
      id: { $ne: userId, $nin: currentUser.following }
    }).select("id name avatar level authId");

    res.status(200).json(users);
  } catch (err) {
    console.error("Lỗi lấy danh sách chưa follow:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
