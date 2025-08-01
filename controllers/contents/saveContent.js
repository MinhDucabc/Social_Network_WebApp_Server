// POST /contents/save-content
import Content from "../../models/content.js";
import User from "../../models/user.js";

// lay id, cap nhat savedBy, savedCount cua content va user
export const saveContent = async (req, res) => {
  const {contentId, userId} = req.body;

  try {
    const content = await Content.findOne({id: contentId});
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const user = await User.findOne({id: userId});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!content.savedBy) content.savedBy = [];
    if (!content.savedCount) content.savedCount = 0;
    if (!user.savedContents) user.savedContents = [];

    const savedIndex = content.savedBy.findIndex(id => id === user.id);

    const savedContentIndex = user.savedContents.findIndex(
        item => item.contentId === content.id
      );

    if (savedIndex === -1) {
      // chua save, them vao
      content.savedBy.push(user.id);
      content.savedCount += 1;
      user.savedContents.push({ contentId: content.id, contentType: content.type });
    } else {
      // da save, xoa di
      content.savedBy.splice(savedIndex, 1);
      content.savedCount -= 1;
      if (savedContentIndex !== -1) {
        user.savedContents.splice(savedContentIndex, 1);
      }
    }
    
    await content.save();
    await user.save();

    res.json({
      message: "success",
      contentId: content.id,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      actionType: savedIndex === -1 ? "save" : "unsaved",
    });

  } catch (err) {
    console.error("Error saving content:", err);
    res.status(500).json({ message: "Server error" });
  }
};
