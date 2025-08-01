import Tag from "../../models/tag.js";

// CREATE
export const createTag = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const newTag = await Tag.create({ name, description, icon });
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getallcurrenttags = async (req, res) => {
  try {
    const { ids } = req.body

    const selectedTags = await Tag.find({id : {$in: ids}})
    
    return res.status(200).json(selectedTags)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// READ ALL
export const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Tag.findOneAndUpdate({ id }, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await Tag.findOneAndDelete({ id });
    res.status(200).json({ message: "Tag deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
