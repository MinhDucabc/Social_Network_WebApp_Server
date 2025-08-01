  import Content from "../../models/content.js";

  export const getRandomContents = async (req, res) => {
    try {
      const {
        limit = 10,
        excludeIds = [],
        type,
        searchTerm,
        sortValue,
      } = req.body;

      const matchConditions = [];

      if (type && type !== "all") {
        matchConditions.push({ type });
      }

      if (searchTerm) {
        const regex = new RegExp(searchTerm, "i");
        matchConditions.push({
          $or: [
            { title: { $regex: regex } },
            { content: { $regex: regex } },
            { description: { $regex: regex } },
          ],
        });
      }

      if (excludeIds.length > 0) {
        matchConditions.push({ id: { $nin: excludeIds } });
      }
      
      const isRandom = !sortValue;
      const pipeline = [
        ...(matchConditions.length > 0
          ? [{ $match: { $and: matchConditions } }]
          : []),

        ...(isRandom
          ? [{ $sample: { size: parseInt(limit) } }]
          : []),
        {
          $addFields: {
            repliesCount: { $size: { $ifNull: ["$replies", []] } },
            commentsCount: { $size: { $ifNull: ["$comments", []] } },
            upvotesCount: { $size: { $ifNull: ["$upvotedBy", []] } },
            downvotesCount: { $size: { $ifNull: ["$downvotedBy", []] } },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "id",
            as: "user",
            pipeline: [
              { $project: { id: 1, name: 1, avatar: 1, date: 1 } },
            ],
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "id",
            as: "tags",
            pipeline: [
              { $project: { id: 1, name: 1 } },
            ],
          },
        },
        {
          $lookup: {
            from: "groups",
            localField: "groupid",
            foreignField: "id",
            as: "group",
          },
        },
        {
          $unwind: {
            path: "$group",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...(!isRandom
          ? [
              { $sort: (() => {
                switch (sortValue) {
                  case "highest":
                    return { upvotesCount: -1 };
                  case "most-reply":
                    return { repliesCount: -1 };
                  case "most-comment":
                    return { commentsCount: -1 };
                  case "newest":
                    return { createdAt: -1 };
                  default:
                    return { createdAt: -1 };
                }
              })() },
              { $limit: parseInt(limit) },
            ]
          : []
        ),
      ];

      const contents = await Content.aggregate(pipeline);

      return res.status(200).json({
        success: true,
        data: contents,
      });

    } catch (err) {
      console.error("Error fetching random contents:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch random contents",
      });
    }
  };
