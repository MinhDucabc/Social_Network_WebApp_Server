import User from "../../models/user.js";

export const getUnfollowedUsers = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;

    console.log(`🔍 Fetching unfollowed users for userId: ${userId}, page: ${page}, skip: ${skip}, limit: ${limit}`);

    const currentUser = await User.findOne({ id: userId });
    if (!currentUser) {
      console.log(`❌ User not found: ${userId}`);
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Đếm tổng số user có thể follow
    const totalCount = await User.countDocuments({
      id: { $ne: userId, $nin: currentUser.following }
    });

    console.log(`📊 Total unfollowed users: ${totalCount}`);

    const users = await User.find({
      id: { $ne: userId, $nin: currentUser.following }
    })
      .select("id name avatar level authId")
      .skip(skip)
      .limit(limit);

    console.log(`✅ Returning ${users.length} users for page ${page}`);

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách chưa follow:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
