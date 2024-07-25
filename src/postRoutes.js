const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Create Post
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content, author_id: req.user._id });
  try {
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: 'Error creating post' });
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author_id', 'username');
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching posts' });
  }
});

// Get My Posts
router.get('/my-posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author_id: req.user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching my posts' });
  }
});

// Update Post
router.put('/:id', auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author_id: req.user._id },
      { title, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: 'Error updating post' });
  }
});

// Delete Post
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ _id: req.params.id, author_id: req.user._id });
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting post' });
  }
});

module.exports = router;
