const express        = require('express');
const router         = express.Router();
const verifyToken    = require('../middleware/auth');
const { validatePost } = require('../middleware/validate');
const {
  getAllPosts,
  getPost,
  getMyPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postcontroller');

router.get('/',       getAllPosts);
router.get('/my',     verifyToken, getMyPosts);  // ← must be before /:id
router.get('/:id',    getPost);
router.post('/',      verifyToken, validatePost, createPost);
router.put('/:id',    verifyToken, validatePost, updatePost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
