import User from "../../models/user.js";


// Lấy thông tin chi tiết danh sách followers
export const getFollowersByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid format' });

    const followers = await User.find({ id: { $in: ids } })
      .select('id name avatar authId'); // giới hạn field

    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message  });
  }
};