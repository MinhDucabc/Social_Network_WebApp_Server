import Content from "../../models/content.js";

// PUT - update content bằng id trong body
export const updateContent = async (req, res) => {
  const { id, updateData } = req.body;
  console.log(updateData)
  if (!id) {
    return res.status(400).json({ message: "Missing content id in request body" });
  }

  try {
    const updated = await Content.findOneAndUpdate({ id: id }, updateData);
    
    if (!updated) {
      return res.status(404).json({ message: "Content not found" });
    }
    const fullUpdated = await Content.aggregate([
      { $match: { id } },
      {
        $lookup: {
          from: "users", // tên collection (viết thường, số nhiều)
          localField: "userid",
          foreignField: "id",
          as: "user",
          pipeline: [
            {
              $project: {
                id: 1,
                name: 1,
                avatar: 1,
              }
            }
          ]
        },
      },
      { $unwind: "$user" }, // Nếu bạn chỉ có 1 user
      {
        $lookup: {
          from: "tags", // tên collection (viết thường, số nhiều)
          localField: "tags",
          foreignField: "id",
          as: "tags",
          pipeline: [
            {
              $project: {
                id: 1,
                name: 1,
              }
            }
          ]
        },
      },
    ]);

    res.json({ message: "Content updated", content: fullUpdated[0] });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};