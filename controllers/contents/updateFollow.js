import User from "../../models/user.js";

export const updateFollow = async (req, res) => {
  let { followedUserIds, currentUserId } = req.body;

  try {
    const currentUser = await User.findOne({ id: currentUserId });
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "Current user not found" });
    }

    // Bước 1: Cập nhật mảng FOLLOWING của currentUser
    currentUser.following = followedUserIds;
    await currentUser.save();

    // Bước 2: Duyệt toàn bộ user trong hệ thống và cập nhật follower
    const allUsers = await User.find({}); // Lấy tất cả users để xử lý cập nhật followers
    for (const user of allUsers) {
      const isFollowed = followedUserIds.includes(user.id);

      // Nếu người này là người được follow → thêm currentUser vào followers nếu chưa có
      if (isFollowed && !user.followers.includes(currentUserId)) {
        user.followers.push(currentUserId);
        await user.save();
      }

      // Nếu người này không còn được follow → remove currentUser khỏi followers nếu có
      if (!isFollowed && user.followers.includes(currentUserId)) {
        user.followers = user.followers.filter((id) => id !== currentUserId);
        await user.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
