const pool = require('../config/db');

// GET all comments for a post (public)
const getComments = async (req, res) => {
  try {
    const [comments] = await pool.query(`
      SELECT comments.id, comments.content,
             comments.created_at, users.name AS author
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
    `, [req.params.id]);

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE comment (protected)
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user.id;
    const post_id = req.params.id;

    // Check if post exists
    const [posts] = await pool.query(
      'SELECT id FROM posts WHERE id = ?', [post_id]
    );
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [post_id, user_id, content]
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { id: result.insertId, content }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE comment (only owner)
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user.id;

    // Check if comment belongs to this user
    const [comments] = await pool.query(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [req.params.commentId, user_id]
    );

    if (comments.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Comment not found or you are not the owner'
      });
    }

    await pool.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, req.params.commentId]
    );

    res.json({ success: true, message: 'Comment updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE comment (only owner)
const deleteComment = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Check if comment belongs to this user
    const [comments] = await pool.query(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [req.params.commentId, user_id]
    );

    if (comments.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Comment not found or you are not the owner'
      });
    }

    await pool.query(
      'DELETE FROM comments WHERE id = ?',
      [req.params.commentId]
    );

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getComments, createComment, updateComment, deleteComment };