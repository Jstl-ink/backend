/**
 * The CreatorController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/CreatorService');
const createPage = async (request, response) => {
  await Controller.handleRequest(request, response, service.createPage);
};

const createPageDetailsByPageId = async (request, response) => {
  await Controller.handleRequest(request, response, service.createPageDetailsByPageId);
};

const deletePageByPageId = async (request, response) => {
  await Controller.handleRequest(request, response, service.deletePageByPageId);
};

const getCreatorPageById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getCreatorPageById);
};

const updatePageDetailsByPageId = async (request, response) => {
  await Controller.handleRequest(request, response, service.updatePageDetailsByPageId);
};


module.exports = {
  createPage,
  createPageDetailsByPageId,
  deletePageByPageId,
  getCreatorPageById,
  updatePageDetailsByPageId,
};
