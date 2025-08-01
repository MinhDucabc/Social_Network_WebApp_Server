import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Auth from '../../models/auth.js';
import User from '../../models/user.js';

import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await Auth.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuth = await Auth.create({email, password: hashedPassword });

    const newUser = await User.create({
      name,
      authId: newAuth.id,
    });

    res.status(201).json({ message: 'Đăng ký thành công', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: 'Đăng ký thất bại', detail: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const authUser = await Auth.findOne({ email });
    if (!authUser) return res.status(400).json({ error: 'Email không tồn tại' });

    const match = await bcrypt.compare(password, authUser.password);
    if (!match) return res.status(400).json({ error: 'Sai mật khẩu' });

    const token = jwt.sign({ authId: authUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({token});
  } catch (err) {
    res.status(500).json({ error: 'Đăng nhập thất bại', detail: err.message });
  }
};
