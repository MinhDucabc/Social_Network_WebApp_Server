import Content from "../../models/content.js";

export const getContentsByIds = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "Danh sách ID không hợp lệ." });
  }

  try {
    const contents = await Content.aggregate([
      {
        $match: {
          id: { $in: ids },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "id",
          as: "user",
          pipeline: [
            { $project: { id: 1, name: 1, avatar: 1, date: 1 } }
          ]
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.status(200).json({ contents });
  } catch (error) {
    console.error("Fetch by IDs failed:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
