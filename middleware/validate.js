// ── Auth validation ───────────────────────────────────────
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};

// ── Post validation ───────────────────────────────────────
const validatePost = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  if (title.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Title must be at least 3 characters' });
  }

  if (!content || content.trim() === '') {
    return res.status(400).json({ success: false, message: 'Content is required' });
  }

  if (content.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Content must be at least 10 characters' });
  }

  next();
};

// ── Comment validation ────────────────────────────────────
const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
  }

  if (content.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Comment is too short' });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validatePost, validateComment };