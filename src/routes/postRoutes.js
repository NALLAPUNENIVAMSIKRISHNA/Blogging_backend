// routes/postRoutes.js

const express = require('express');
const { createPost, getPosts, getPost, updatePost, deletePost, getUserPosts } = require('../controllers/postController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', getPosts);
router.get('/my-posts', authenticate, getUserPosts);
router.get('/:id', getPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;
