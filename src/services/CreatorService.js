/* eslint-disable no-unused-vars */
const Service = require('./Service');
const googleSheetsService = require('./GoogleSheetService');

/**
 * Creates a new user page
 * @param {Object} params - Request parameters
 * @param {Object} params.body - Page data to create
 * @returns {Promise} Resolves with created page or rejects with error
 */
const createPage = ({ body }) => new Promise((resolve, reject) => {
  const createUserPage = async () => {
    try {
      const newPage = await googleSheetsService.createPage(body);
      resolve(Service.successResponse({
        newPage,
      }));
    } catch (e) {
      console.error('Error in createPage:', e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 500,
      ));
    }
  };
  createUserPage();
});

/**
 * Initializes page details (deprecated - use PATCH for updates)
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to update
 * @param {Object} params.body - New page data
 * @returns {Promise} Resolves with updated page or rejects with error
 */
const createPageDetailsByPageId = ({ pageId, body }) => new Promise((resolve, reject) => {
  const createDetails = async () => {
    try {
      const page = await googleSheetsService.getCreatorPageById(pageId);
      if (!page) {
        reject(Service.rejectResponse(
          `No page found with id ${pageId}`,
          404,
        ));
      }

      const updatedPage = await googleSheetsService.createPage({
        ...page,
        ...body,
      });

      await googleSheetsService.deletePageByPageId(pageId);

      resolve(Service.successResponse({
        updatedPage,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  };
  createDetails();
});

/**
 * Deletes a user page
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to delete
 * @returns {Promise} Resolves with success message or rejects with error
 */
const deletePageByPageId = ({ pageId }) => new Promise((resolve, reject) => {
  const deleteUserPage = async () => {
    try {
      const deletedPage = await googleSheetsService.deletePageByPageId(pageId);
      resolve(Service.successResponse({
        deletedPage,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  };
  deleteUserPage();
});

/**
 * Gets a creator page by ID
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to fetch
 * @returns {Promise} Resolves with page data or rejects with error
 */
const getCreatorPageById = ({ pageId }) => new Promise((resolve, reject) => {
  const getPage = async () => {
    try {
      const page = await googleSheetsService.getCreatorPageById(pageId);
      resolve(Service.successResponse({
        page,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  };
  getPage();
});

/**
 * Updates page details
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to update
 * @param {Object} params.body - Updated page data
 * @returns {Promise} Resolves with updated page or rejects with error
 */
const updatePageDetailsByPageId = ({ pageId, body }) => new Promise((resolve, reject) => {
  const updatePage = async () => {
    try {
      const page = await googleSheetsService.getCreatorPageById(pageId);
      if (!page) throw new Error(`No page with id ${pageId} found.`);

      const updatedPage = await googleSheetsService.createPage({
        ...page,
        ...body,
      });

      await googleSheetsService.deletePageByPageId(pageId);

      resolve(Service.successResponse({
        updatedPage,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  };
  updatePage();
});

module.exports = {
  createPage,
  createPageDetailsByPageId,
  deletePageByPageId,
  getCreatorPageById,
  updatePageDetailsByPageId,
};
