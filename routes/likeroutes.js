const express       = require('express');
const router        = express.Router({ mergeParams: true });
const verifyToken   = require('../middleware/auth');
const { toggleLike, getLikes } = require('../controllers/likecontroller');

router.get('/',  verifyToken, getLikes);
router.post('/', verifyToken, toggleLike);

module.exports = router;