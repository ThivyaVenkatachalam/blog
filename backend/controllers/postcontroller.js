const pool = require('../config/db');

// GET all posts (public)
const getAllPosts = async (req, res) => {
  try {
    const search   = req.query.search || '';
    const sortBy   = req.query.sort   || 'newest';

    const orderBy  = sortBy === 'popular'
      ? 'like_count DESC'
      : 'posts.created_at DESC';

    const [posts] = await pool.query(`
      SELECT posts.id, posts.title, posts.content,
             posts.created_at, users.name AS author,
             COUNT(DISTINCT comments.id) AS comment_count,
             COUNT(DISTINCT likes.id)   AS like_count
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN comments ON comments.post_id = posts.id
      LEFT JOIN likes    ON likes.post_id    = posts.id
      WHERE posts.title LIKE ?
      GROUP BY posts.id
      ORDER BY ${orderBy}
    `, [`%${search}%`]);

    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single post by id (public)
const getPost = async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT posts.id, posts.title, posts.content,
             posts.created_at, users.name AS author
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
    `, [req.params.id]);

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: posts[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE post (protected)
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [user_id, title, content]
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { id: result.insertId, title, content }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE post (protected - only owner)
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user_id = req.user.id;

    // Check if post belongs to this user
    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE id = ? AND user_id = ?',
      [req.params.id, user_id]
    );

    if (posts.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Post not found or you are not the owner'
      });
    }

    await pool.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [title, content, req.params.id]
    );

    res.json({ success: true, message: 'Post updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE post (protected - only owner)
const deletePost = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE id = ? AND user_id = ?',
      [req.params.id, user_id]
    );

    if (posts.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Post not found or you are not the owner'
      });
    }

    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/posts/my  — get only logged in user's posts
const getMyPosts = async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT posts.id, posts.title, posts.content,
             posts.created_at, users.name AS author,
             COUNT(DISTINCT comments.id) AS comment_count,
             COUNT(DISTINCT likes.id)    AS like_count
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN comments ON comments.post_id = posts.id
      LEFT JOIN likes    ON likes.post_id    = posts.id
      WHERE posts.user_id = ?
      GROUP BY posts.idd
      ORDER BY posts.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllPosts, getPost, getMyPosts, createPost, updatePost, deletePost };