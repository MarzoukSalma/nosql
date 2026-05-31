const express = require('express');
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const NetworkController = require('./network.controller');

router.use(authMiddleware);

router.get('/connections',                        NetworkController.getMyConnections);
router.get('/requests',                           NetworkController.getPendingRequests);
router.get('/suggestions',                        NetworkController.getSuggestions);
router.get('/status/:userId',                     NetworkController.getRelationStatus);
router.post('/request/:userId',                   NetworkController.sendRequest);
router.post('/request/:userId/accept',            NetworkController.acceptRequest);
router.post('/request/:userId/decline',           NetworkController.declineRequest);
router.delete('/connection/:userId',              NetworkController.removeConnection);

module.exports = router;