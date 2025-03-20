/**
 * The PageController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const PageService = require('../services/PageService');

const getPageById = async (req, res) => {
  try {
    const { pageId } = req.params;
    const response = await PageService.getPageById({ pageId });
    res.status(200).json(response);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const createPage = async (req, res) => {
  try {
    const {
      id, name, bio, img,
    } = req.body;
    const response = await PageService.createPage({
      id, name, bio, img,
    });
    res.status(201).json(response);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const addLink = async (req, res) => {
  try {
    const { pageId } = req.params;
    const link = req.body;
    const response = await PageService.addLinkToPage({ pageId, link });
    res.status(200).json(response);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = {
  getPageById,
  createPage,
  addLink,
};
