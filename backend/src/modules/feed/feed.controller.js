const FeedService = require('./feed.service.js');

const createPost = async (req, res) => {
  try {
    const post = await FeedService.createPost(req.userId, req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getFeed = async (req, res) => {
  try {
    const { page = 0, limit = 20 } = req.query;
    const skip = page * limit;
    const feed = await FeedService.getFeed(req.userId, { skip: +skip, limit: +limit });
    res.json({ success: true, data: feed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const result = await FeedService.toggleLike(req.userId, req.params.postId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const comment = await FeedService.addComment(req.userId, req.params.postId, req.body);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await FeedService.getComments(req.params.postId);
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await FeedService.deletePost(req.userId, req.params.postId);
    res.json({ success: true, message: 'Post supprimé' });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

module.exports = {
  createPost,
  getFeed,
  toggleLike,
  addComment,
  getComments,
  deletePost,
};