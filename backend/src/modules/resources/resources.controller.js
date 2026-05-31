const ResourcesService = require('./resources.service');

const createResource = async (req, res) => {
  try {
    const resource = await ResourcesService.createResource(req.userId, req.body, req.file);
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getResources = async (req, res) => {
  try {
    const { type, departement, tag, search, page = 0, limit = 20 } = req.query;
    const skip = page * limit;
    const resources = await ResourcesService.getResources({
      type, departement, tag, search,
      skip: +skip, limit: +limit,
    });
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await ResourcesService.getResourceById(req.params.resourceId, req.userId);
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const toggleSave = async (req, res) => {
  try {
    const result = await ResourcesService.toggleSave(req.userId, req.params.resourceId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getSavedResources = async (req, res) => {
  try {
    const resources = await ResourcesService.getSavedResources(req.userId);
    res.json({ success: true, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const incrementDownload = async (req, res) => {
  try {
    await ResourcesService.incrementDownload(req.params.resourceId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const requestResource = async (req, res) => {
  try {
    const request = await ResourcesService.requestResource(req.userId, req.body);
    res.status(201).json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    await ResourcesService.deleteResource(req.userId, req.params.resourceId);
    res.json({ success: true, message: 'Ressource supprimée' });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  toggleSave,
  getSavedResources,
  incrementDownload,
  requestResource,
  deleteResource,
};