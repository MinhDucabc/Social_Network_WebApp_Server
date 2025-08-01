import Content from "../../models/content.js";

export const updateVote = async (req, res) => {
  try {
    const { contentId, userId, action } = req.body;

    if (!contentId || !userId || !["upvote", "downvote", "unvote"].includes(action)) {
      return res.status(400).json({ message: "Thiếu hoặc sai thông tin truyền vào." });
    }

    const content = await Content.findOne({ id: contentId });
    if (!content) {
      return res.status(404).json({ message: "Không tìm thấy nội dung." });
    }

    // Khởi tạo votes nếu chưa có
    if (!Array.isArray(content.votes)) content.votes = [];

    // Tìm vote hiện tại của user
    const existingVoteIndex = content.votes.findIndex(v => v.userId === userId);

    // Nếu đã vote cùng kiểu => xoá (tức là huỷ vote)
    if (action === "unvote") {
      if (existingVoteIndex !== -1) {
        content.votes.splice(existingVoteIndex, 1);
      }
    } else {
      // Nếu khác kiểu => cập nhật hoặc thêm mới
      const newVote = {
        userId,
        type: action,
        time: new Date()
      };

      if (existingVoteIndex !== -1) {
        content.votes[existingVoteIndex] = newVote;
      } else {
        content.votes.push(newVote);
      }
    }

    // Tính lại tổng số upvote/downvote
    const upvotesCount = content.votes.filter(v => v.type === "upvote").length;
    const downvotesCount = content.votes.filter(v => v.type === "downvote").length;

    content.upvotesCount = upvotesCount;
    content.downvotesCount = downvotesCount;

    content.upvotedBy = content.votes.filter(v => v.type === "upvote").map(v => v.userId);
    content.downvotedBy = content.votes.filter(v => v.type === "downvote").map(v => v.userId);

    await content.save();

    res.status(200).json({
      message: "Cập nhật vote thành công.",
      upvotesCount,
      downvotesCount,
      upvotedBy: content.upvotedBy,
      downvotedBy: content.downvotedBy,
      votes: content.votes
    });
  } catch (error) {
    console.error("Vote update failed:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
