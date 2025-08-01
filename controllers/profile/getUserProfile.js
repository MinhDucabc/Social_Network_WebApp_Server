import User from "../../models/user.js";
import mongoose from "mongoose";

export const getUserProfileById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({id: id});

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
}

export const getUserProfileByAuthId = async (req, res) => {
  try {
    const { authId } = req.params;

    const result = await User.aggregate([
      { $match: { authId } },
      // Lookup followers
      {
        $lookup: {
          from: "users", // tên collection (phải là số nhiều, viết thường)
          localField: "followers",
          foreignField: "id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "id",
          as: "following",
          
        },
      },

      // Project: lấy các trường cần thiết, followers & following là danh sách id
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
              in: "$$f.id",
            },
          },
          following: {
            $map: {
              input: "$following",
              as: "f",
              in: "$$f.id",
            },
          },
        },
      },

      // Giới hạn chỉ 1 kết quả
      { $limit: 1 }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Get profile by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
