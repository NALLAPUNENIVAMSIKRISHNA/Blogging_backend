// controllers/postController.js

const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = new Post({ title, content, author_id: req.user.id });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author_id', 'username email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author_id', 'username email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author_id', 'username email');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author_id: req.user.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.updated_at = Date.now();

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('Post not found');
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author_id.toString() !== req.user.id) {
      console.log('Unauthorized attempt to delete post');
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: err.message });
  }
};
