const express       = require('express');
const router        = express.Router();
const verifyToken   = require('../middleware/auth');
const {
  getProfile,
  updateName,
  updatePassword
} = require('../controllers/usercontroller');

router.get('/',                verifyToken, getProfile);
router.put('/update-name',     verifyToken, updateName);
router.put('/update-password', verifyToken, updatePassword);

module.exports = router;