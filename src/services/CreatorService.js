/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create new link on the user page
*
* pageId String ID of order that needs to be fetched
* body Link
* returns Link
* */
const createLinkByPageId = ({ pageId, body }) => new Promise(
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
/**
* Create new user page
*
* body CreatePageRequest
* returns Page
* */
const createPage = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const { id } = body;
      console.log(id);
      // TODO create table with name of id (= email)
      resolve(Service.successResponse({
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
/**
* Delete a user page
*
* pageId String ID of order that needs to be fetched
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
* pageId String ID of order that needs to be fetched
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
* pageId String ID of order that needs to be fetched
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
* Update page details of user page
*
* pageId String ID of order that needs to be fetched
* body Page
* returns Page
* */
const updatePageByPageId = ({ pageId, body }) => new Promise(
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
/**
* Update a social link on user page
*
* pageId String ID of order that needs to be fetched
* body Link
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
  updatePageByPageId,
  updateSocialLinkByPageId,
};
