const Comment = require('../models/Comment');

// Create Comment
exports.createComment = async (req, res) => {
  const { post_id, content } = req.body;
  try {
    const newComment = new Comment({ post_id, content, author_id: req.user.id });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read Comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.query.post_id }).populate('author_id', 'username email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read Single Comment
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('author_id', 'username email');
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// src/controllers/commentController.js

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Assuming you have user authentication and the user ID is stored in req.user

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
};


// src/controllers/commentController.js

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // Assuming you have user authentication and the user ID is stored in req.user

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await comment.remove();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};
