/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create new link on the user page
*
* pageId Long ID of order that needs to be fetched
* returns Link
* */
const createLinkByPageId = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create new user page
*
* returns Page
* */
const createPage = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete a user page
*
* pageId Long ID of order that needs to be fetched
* no response value expected for this operation
* */
const deletePageByPageId = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get the creator page
*
* pageId Long ID of order that needs to be fetched
* returns Page
* */
const getCreatorPageById = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Logout user from creator page
*
* pageId Long ID of order that needs to be fetched
* no response value expected for this operation
* */
const logoutUser = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update a link on user page
*
* pageId Long ID of order that needs to be fetched
* link Link  (optional)
* returns Link
* */
const updateLinkByPageId = ({ pageId, link }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
        link,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update a social link on user page
*
* pageId Long ID of order that needs to be fetched
* body Link  (optional)
* returns Link
* */
const updateSocialLinkByPageId = ({ pageId, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
        body,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createLinkByPageId,
  createPage,
  deletePageByPageId,
  getCreatorPageById,
  logoutUser,
  updateLinkByPageId,
  updateSocialLinkByPageId,
};
