const pool   = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/profile/update-name
const updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }

    await pool.query(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, req.user.id]
    );

    res.json({ success: true, message: 'Name updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/profile/update-password
const updatePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    // 1. Get current password from DB
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [req.user.id]
    );

    // 2. Check old password is correct
    const isMatch = await bcrypt.compare(old_password, users[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    // 3. Hash new password and save
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashed, req.user.id]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateName, updatePassword };