import Comment from "../../models/comment.js";

// POST /comments/by-post-ids
export const getCommentsByPostIds = async (req, res) => {
  try {
    const { postIds } = req.body;

    const comments = await Comment.aggregate([
      {
        $match: { postId: { $in: postIds } },
      },
      {
        $lookup: {
          from: "users", // collection name
          localField: "userId", // string UUID field in Comment
          foreignField: "id", // UUID field in User model
          as: "user",
          pipeline: [
            { $project: { id: 1, name: 1, avatar: 1, date: 1 } }
          ]
        },
      },
      {
        $unwind: "$user", // biến user thành object thay vì array
      },
    ]);

    const grouped = {};
    for (const c of comments) {
      if (!grouped[c.postId]) grouped[c.postId] = [];
      grouped[c.postId].push(c);
    }

    // Sort each group by date (newest first or oldest first)
    for (const postId in grouped) {
      grouped[postId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mới nhất trước
    }
    
    res.json(grouped);
  } catch (error) {
    console.error("Error fetching comments by post IDs:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
