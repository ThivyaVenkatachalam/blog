const pool = require('../config/db');

// POST /api/posts/:id/like  — toggle like/unlike
const toggleLike = async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user.id;

    // Check if already liked
    const [existing] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [post_id, user_id]
    );

    if (existing.length > 0) {
      // Already liked → unlike
      await pool.query(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [post_id, user_id]
      );
      const [count] = await pool.query(
        'SELECT COUNT(*) AS total FROM likes WHERE post_id = ?',
        [post_id]
      );
      return res.json({
        success: true,
        message: 'Post unliked',
        liked: false,
        likes: count[0].total
      });
    } else {
      // Not liked → like
      await pool.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [post_id, user_id]
      );
      const [count] = await pool.query(
        'SELECT COUNT(*) AS total FROM likes WHERE post_id = ?',
        [post_id]
      );
      return res.json({
        success: true,
        message: 'Post liked',
        liked: true,
        likes: count[0].total
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/posts/:id/like  — get like count + check if liked
const getLikes = async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user ? req.user.id : null;

    const [count] = await pool.query(
      'SELECT COUNT(*) AS total FROM likes WHERE post_id = ?',
      [post_id]
    );

    let liked = false;
    if (user_id) {
      const [existing] = await pool.query(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [post_id, user_id]
      );
      liked = existing.length > 0;
    }

    res.json({
      success: true,
      likes: count[0].total,
      liked
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { toggleLike, getLikes };