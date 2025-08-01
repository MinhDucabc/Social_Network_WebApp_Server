import Content from "../../models/content.js";

// DELETE - xoá content bằng id trong body
export const deleteContent = async (req, res) => {
  console.log(req.body)
  const { contentId } = req.body;
  if (!contentId) {
    return res
      .status(400)
      .json({ message: "Missing content id in request body" });
  }

  try {
    const deleted = await Content.findOneAndDelete({ id: contentId });

    if (!deleted) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({ message: "Content deleted", content: deleted });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
