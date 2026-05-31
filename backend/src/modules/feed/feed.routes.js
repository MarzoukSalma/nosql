const express = require('express');
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const upload = require('../../utils/upload');

const FeedController = require('./feed.controller.js');

router.use(authMiddleware);

router.get('/',                          FeedController.getFeed);
router.post('/', upload.single('media'), FeedController.createPost);
router.delete('/:postId',                FeedController.deletePost);
router.post('/:postId/like',             FeedController.toggleLike);
router.get('/:postId/comments',          FeedController.getComments);
router.post('/:postId/comments',         FeedController.addComment);

module.exports = router;