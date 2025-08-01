import Content from "../../models/content.js";

export const fetchSavedContentsUsers = async (req, res) => {
  try {
    const { contentIds } = req.body;

    const savedContents = await Content.aggregate([
      {
        $match: {
          id: { $in: contentIds },
        },
      },
      {
        $unwind: "$savedBy",
      },
      {
        $lookup: {
          from: "users",
          localField: "savedBy",
          foreignField: "id",
          as: "user",
          pipeline: [
            {
              $project: {
                id: 1,
                name: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          contentId: "$id",
          user: {
            id: "$user.id",
            name: "$user.name",
            avatar: "$user.avatar",
          },
        },
      },
      {
        $group: {
          _id: "$contentId",
          users: { $push: "$user" },
        },
      },
      {
        $project: {
          contentId: "$_id",
          users: 1,
          _id: 0,
        },
      },
    ]);

    res.json(savedContents);
  } catch (error) {
    console.error("Error fetching saved contents user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
