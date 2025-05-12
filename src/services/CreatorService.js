/* eslint-disable no-unused-vars */
const Service = require('./Service');
const googleSheetsService = require('./GoogleSheetService');

/**
 * Gets a creator page by ID
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to fetch
 * @returns {Promise} Resolves with page data or rejects with error
 */
const getCreatorPageById = async ({ pageId }) => {
  try {
    const page = await googleSheetsService.getCreatorPageById(pageId);
    return Service.successResponse(page);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Invalid input',
      e.status || 405,
    );
  }
};

/**
 * Creates a new user page
 * @param {Object} params - Request parameters
 * @param {Object} params.body - Page data to create
 * @returns {Promise} Resolves with created page or rejects with error
 */
const createPage = async ({ body }) => {
  try {
    const newPage = await googleSheetsService.createPage(body);
    return Service.successResponse({ newPage });
  } catch (e) {
    console.error('Error in createPage:', e);
    return Service.rejectResponse(
      e.message || 'Invalid input',
      e.status || 500,
    );
  }
};

/**
 * Initializes page details (deprecated - use PATCH for updates)
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to update
 * @param {Object} params.body - New page data
 * @returns {Promise} Resolves with updated page or rejects with error
 */
const createPageDetailsByPageId = async ({ pageId, body }) => {
  try {
    const page = await googleSheetsService.getPageByHandle(pageId);
    if (!page) {
      return Service.rejectResponse(
        `No page found with id ${pageId}`,
        404,
      );
    }

    const updatedPage = await googleSheetsService.createPage({
      ...page,
      ...body,
    });

    await googleSheetsService.deletePageByPageId(pageId);

    return Service.successResponse({ updatedPage });
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Invalid input',
      e.status || 405,
    );
  }
};

/**
 * Deletes a user page
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to delete
 * @returns {Promise} Resolves with success message or rejects with error
 */
const deletePageByPageId = async ({ pageId }) => {
  try {
    const deletedPage = await googleSheetsService.deletePageByPageId(pageId);
    return Service.successResponse({ deletedPage });
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Invalid input',
      e.status || 405,
    );
  }
};

/**
 * Updates details of the user page
 * @param {Object} params - Request parameters
 * @param {string} params.pageId - Page ID to update
 * @param {Object} params.body - Updated page data
 * @returns {Promise} Resolves with success message
 */
const updatePageDetailsByPageId = async ({ pageId, body }) => {
  try {
    console.log('Update request received for:', pageId, 'with data:', body);

    // Validate input
    if (!pageId || !body) {
      throw new Error('Missing pageId or update data');
    }

    const result = await googleSheetsService.updatePage(pageId, body);
    return Service.successResponse(result);
  } catch (e) {
    console.error('Update controller error:', e);
    return Service.rejectResponse(
      e.message || 'Update failed',
      e.status || 500,
    );
  }
};

module.exports = {
  createPage,
  createPageDetailsByPageId,
  deletePageByPageId,
  getCreatorPageById,
  updatePageDetailsByPageId,
};
