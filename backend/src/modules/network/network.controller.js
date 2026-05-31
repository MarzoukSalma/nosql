const NetworkService = require('./network.service');

const sendRequest = async (req, res) => {
  try {
    const target = await NetworkService.sendRequest(req.userId, req.params.userId);
    res.status(201).json({ success: true, data: target });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const newFriend = await NetworkService.acceptRequest(req.userId, req.params.userId);
    res.json({ success: true, data: newFriend });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const declineRequest = async (req, res) => {
  try {
    await NetworkService.declineRequest(req.userId, req.params.userId);
    res.json({ success: true, message: 'Demande refusée' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    await NetworkService.removeConnection(req.userId, req.params.userId);
    res.json({ success: true, message: 'Connexion supprimée' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyConnections = async (req, res) => {
  try {
    const connections = await NetworkService.getMyConnections(req.userId);
    res.json({ success: true, data: connections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await NetworkService.getPendingRequests(req.userId);
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const suggestions = await NetworkService.getSuggestions(req.userId, +limit);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRelationStatus = async (req, res) => {
  try {
    const status = await NetworkService.getRelationStatus(req.userId, req.params.userId);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  declineRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getSuggestions,
  getRelationStatus,
};