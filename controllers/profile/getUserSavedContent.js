// fetch user saved contents
import Content from "../../models/content.js";

// tu chuoi object contentId, contentType, lay ra content tu database
export const getUserSavedContent = async (req, res) => {
  try {
    const ids = req.body.ids;
    console.log(ids)
    const savedContentsIds = ids.map((item) => item.contentId);
    console.log(savedContentsIds)

    const savedContents = await Content.aggregate([
      {
        $match: {id: {$in: savedContentsIds}},
      },
      {
        $lookup: {
          from: "users",
          localField: "userid",
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
      // {
      //   $lookup: {
      //     from: "groups",
      //     localField: "groupid",
      //     foreignField: "id",
      //     as: "group",
      //   },
      // },
      // { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: 1,
          title: 1,
          content: 1,
          description: 1,
          type: 1,
          user: { id: 1, name: 1, avatar: 1 },
          // group: { id: 1, name: 1 },
        },
      },
    ]);

    res.json({savedContents});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
