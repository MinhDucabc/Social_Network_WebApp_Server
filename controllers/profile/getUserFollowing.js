import User from "../../models/user.js";


// Lấy thông tin chi tiết danh sách following
export const getFollowingByIds = async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) return res.status(400).json({ error: 'Invalid format' });
  
      const following = await User.find({ id: { $in: ids } })
        .select('id name avatar level authId');
  
      res.json(following);
    } catch (error) {
      res.status(500).json({ error: 'Server error', detail: error.message });
    }
  };