import Reply from "../../models/reply.js";

export const getRepliesByQuestionIds = async (req, res) => {
  try {
    const { questionIds } = req.body;

    // 1. Lấy tất cả reply thuộc các câu hỏi (questionIds)
    const allReplies = await Reply.aggregate([
      {
        $match: { questionId: { $in: questionIds } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
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

    // 2. Tạo Set chứa id của replies con (được lồng bên trong replies khác)
    const nestedReplyIds = new Set();
    allReplies.forEach((reply) => {
      reply.replies.forEach((childId) => nestedReplyIds.add(childId));
    });

    // 3. Lọc ra các replies top-level (không nằm trong replies của reply nào khác)
    const topLevelReplies = allReplies.filter(
      (reply) => !nestedReplyIds.has(reply.id)
    );

    // 4. Group theo questionId
    const grouped = {};
    for (const reply of topLevelReplies) {
      if (!grouped[reply.questionId]) grouped[reply.questionId] = [];
      grouped[reply.questionId].push(reply);
    }

    // 5. Sort each group by date (newest first or oldest first)
    for (const questionId in grouped) {
      grouped[questionId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Mới nhất trước
    }

    res.json(grouped);
  } catch (err) {
    console.error("❌ Error in getRepliesByQuestionIds:", err);
    res.status(500).json({ message: "Server error" });
  }
};
