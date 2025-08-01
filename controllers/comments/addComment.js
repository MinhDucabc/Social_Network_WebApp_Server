import Comment from "../../models/comment.js";
import Content from "../../models/content.js";

export const addComment = async (req, res) => {
  try {
    const { postId, userId, text } = req.body;

    if (!postId || !userId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newComment = await Comment.create({ postId, userId, text });

    await Content.findOneAndUpdate(
      { id: postId },
      {
        $push: { comments: newComment.id },
        $inc: { commentsCount: 1 },
      }
    );

    const [populatedComment] = await Comment.aggregate([
      { $match: { id: newComment.id } },
      {
        $lookup: {
          from: "users", 
          localField: "userId", 
          foreignField: "id", 
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          id: 1,
          postId: 1,
          text: 1,
          date: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            id: "$user.id",
            name: "$user.name",
            avatar: "$user.avatar",
          },
        },
      },
    ]);

    res.status(201).json({
      postId,
      comment: populatedComment,
    });
  } catch (err) {
    console.error("❌ Error in addComment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
