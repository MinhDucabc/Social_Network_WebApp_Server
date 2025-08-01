import Content from "../../models/content.js";

export const getContentById = async (req, res) => {
  const {id} = req.params;
  console.log(`5: ${id}`)
  try {
    const content = await Content.aggregate([
      {
        $match: {
          id: id,
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
    console.log(`31: ${JSON.stringify(content)}`)
    res.status(200).json({ content });
  } catch (error) {
    console.error("Fetch by ID failed:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
