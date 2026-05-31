const express = require('express');
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const ResourcesController = require('./resources.controller');

router.use(authMiddleware);

router.get('/',                                    ResourcesController.getResources);
router.post('/',                                   ResourcesController.createResource);
router.get('/saved',                               ResourcesController.getSavedResources);
router.post('/request',                            ResourcesController.requestResource);
router.get('/:resourceId',                         ResourcesController.getResourceById);
router.delete('/:resourceId',                      ResourcesController.deleteResource);
router.post('/:resourceId/save',                   ResourcesController.toggleSave);
router.post('/:resourceId/download',               ResourcesController.incrementDownload);

module.exports = router;