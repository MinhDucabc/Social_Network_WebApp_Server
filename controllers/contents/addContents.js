import Content from "../../models/content.js";
import User from "../../models/user.js";
import Tag from "../../models/tag.js";

export const addContent = async (req, res) => {
  try {
    const { type, title, content, description, image, groupid, tags, userid } = req.body;

    if (!type || !userid) {
      return res.status(400).json({ message: "Thiếu type hoặc userid" });
    }

    const newContent = new Content({
      type,
      title,
      content,
      description,
      image,
      groupid,
      tags,
      userid,
      comments: [],
      commentsCount: 0,
      replies: [],
      repliesCount: 0,
      upvotedBy: [],
      upvotesCount: 0,
      downvotedBy: [],
      downvotesCount: 0,
    });

    const savedContent = await newContent.save();

    // Cập nhật contents trong user
    await User.findOneAndUpdate(
      { id: userid },
      {
        $push: {
          contents: {
            contentId: savedContent.id,
            contentType: type,
          },
        },
      }
    );

    // ✅ Cập nhật mỗi tag (nếu cần đếm content/tag)
    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map(async (tagId) => {
          await Tag.findOneAndUpdate(
            { id: tagId },
            {
              $push: {
                contents: {
                  contentId: savedContent.id,
                  contentType: type,
                },
              },
              $inc: { contentsCount: 1 },
            }
          );
        })
      );
    }

    // Dùng aggregation để join thông tin user
    const result = await Content.aggregate([
      { $match: { id: savedContent.id } },
      {
        $lookup: {
          from: "tags", // ✅ tên collection viết thường & số nhiều
          localField: "tags",
          foreignField: "id",
          as: "tags",
          pipeline: [
            {
              $project: {
                id: 1,
                name: 1,
                icon: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users", // ← tên collection, viết thường và số nhiều
          localField: "userid",
          foreignField: "id", // ← dùng UUID, không phải _id
          as: "user",
          pipeline: [
            {
              $project: {
                id: 1,
                name: 1,
                avatar: 1,
                date: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("❌ Server error at /contents/add-content:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
