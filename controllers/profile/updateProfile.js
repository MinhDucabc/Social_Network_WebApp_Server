import User from "../../models/user.js";

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      avatar,
      bio,
      personalLink
    } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (bio !== undefined) updateFields.bio = bio;
    if (personalLink !== undefined) updateFields.personalLink = personalLink;

    // Kiểm tra tên không được trùng với người khác (ngoại trừ chính người dùng hiện tại)
    if (name) {
      const existingUser = await User.findOne({ name, id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Tên người dùng đã được sử dụng." });
      }
    }

    // Cập nhật user
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Dùng lại aggregate để trả về dữ liệu đầy đủ như fetch
    const result = await User.aggregate([
      { $match: { id: userId } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "id",
          as: "followers"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "id",
          as: "following"
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          avatar: 1,
          bio: 1,
          personalLink: 1,
          date: 1,
          level: 1,
          score: 1,
          authId: 1,
          contents: 1,
          savedContents: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          followers: {
            $map: {
              input: "$followers",
              as: "f",
              in: "$$f.id"
            }
          },
          following: {
            $map: {
              input: "$following",
              as: "f",
              in: "$$f.id"
            }
          }
        }
      },
      { $limit: 1 }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Updated user not found in aggregation" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: result[0]
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
