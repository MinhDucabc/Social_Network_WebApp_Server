import Reply from "../../models/reply.js";
import Content from "../../models/content.js";

export const addReply = async (req, res) => {
  try {
    const { questionId, parentId, userId, text } = req.body;

    if (!questionId || !userId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1. Tạo reply mới
    const newReply = await Reply.create({
      questionId,
      userId,
      text,
      replies: [],
      parentId,
    });

    // 2. Cập nhật reply cha hoặc content
    if (parentId) {
      await Reply.findOneAndUpdate(
        { id: parentId },
        {
          $push: { replies: newReply.id },
        }
      );
    } else {
      await Content.findOneAndUpdate(
        { id: questionId },
        {
          $push: { replies: newReply.id },
          $inc: { repliesCount: 1 },
        }
      );
    }

    // 3. Join user thông qua userId là string (UUID)
    const [populatedReply] = await Reply.aggregate([
      { $match: { id: newReply.id } },
      {
        $lookup: {
          from: "users",             // tên collection
          localField: "userId",      // string trong reply
          foreignField: "id",        // string trong User
          as: "user",
        },
      },
      { $unwind: "$user" },
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

    // 4. Trả về
    res.status(201).json({
      questionId,
      parentId,
      reply: populatedReply,
    });
  } catch (err) {
    console.error("❌ Error in addReply:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
