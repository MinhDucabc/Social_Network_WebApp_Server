import Reply from "../../models/reply.js";

export const getRepliesByReplyIds = async (req, res) => {
  try {
    const { repliesIds } = req.body;
    console.log(repliesIds);
    if (!Array.isArray(repliesIds) || repliesIds.length === 0) {
      return res.json({});
    }
    // 1. Lấy tất cả replies có parentId là replyId
    const replies = await Reply.aggregate([
      {
        $match: { id: { $in: repliesIds } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id", // dùng `id` vì bạn dùng string id
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          id: 1,
          questionId: 1,
          parentId: 1,
          userId: 1,
          text: 1,
          createdAt: 1,
          updatedAt: 1,
          replies: 1,
          user: {
            id: "$user.id",
            name: "$user.name",
            avatar: "$user.avatar",
          },
        }
      }
    ]);

    // 4. Group theo parentId
    const grouped = {};
    for (const reply of replies) {
      if (!grouped[reply.parentId]) grouped[reply.parentId] = [];
      grouped[reply.parentId].push(reply);
    }

    // 5. Sort each group by date (newest first or oldest first)
    for (const parentId in grouped) {
      grouped[parentId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mới nhất trước
    }

    res.json(grouped);
  } catch (err) {
    console.error("❌ Error in getRepliesByReplyIds:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
