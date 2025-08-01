// controllers/userController.js
import Content from "../../models/content.js";

export const getUserContentsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    const contentIds = ids.map(item => item.contentId);
    const contents = await Content.aggregate([
      {
        $match: {
          id: { $in: contentIds },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userid", // content.userid
          foreignField: "id",   // user.id
          as: "user",
          pipeline: [
            {
              $project: {
                name: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "groups",
          localField: "groupid",
          foreignField: "id",
          as: "group",
        },
      },
      { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: 1,
          title: 1,
          content: 1,
          description: 1,
          type: 1,
          user: { name: 1, avatar: 1 },
          group: { name: 1 },
        },
      },
    ]);
    

    res.status(200).json(contents);
  } catch (error) {
    console.error("Get user contents by ids error:", error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách nội dung", detail: error.message });
  }
};
