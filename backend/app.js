const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
const authRoutes    = require('./routes/authroutes');
const postRoutes    = require('./routes/postroutes');
const commentRoutes = require('./routes/commentroutes');
const likeRoutes    = require('./routes/likeroutes');
const userRoutes    = require('./routes/userroutes');

app.use('/api/auth',               authRoutes);
app.use('/api/posts',              postRoutes);
app.use('/api/posts/:id/comments', commentRoutes);
app.use('/api/posts/:id/like',     likeRoutes);
app.use('/api/profile',            userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running!' });
});

module.exports = app;