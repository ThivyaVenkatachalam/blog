const express      = require('express');
const router       = express.Router({ mergeParams: true });
const verifyToken  = require('../middleware/auth');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentcontroller');

router.get('/',              getComments);
router.post('/',             verifyToken, createComment);
router.put('/:commentId',    verifyToken, updateComment);
router.delete('/:commentId', verifyToken, deleteComment);

module.exports = router;