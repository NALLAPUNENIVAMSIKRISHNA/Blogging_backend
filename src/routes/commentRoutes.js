const express = require('express');
const { createComment, getComments, getComment, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createComment);
router.get('/', getComments);
router.get('/:id', getComment);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
