const Service = require('./Service');
const googleSheetsService = require('./GoogleSheetService');

// Add link to page
const createLinkByPageId = ({ pageId }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const newLink = await googleSheetsService.createLinkByPageId(pageId);
      resolve(Service.successResponse(newLink));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error creating link',
        e.status || 500,
      ));
    }
  },
);

// Add entry
const createPage = ({ body }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const newPage = await googleSheetsService.createPage(body);
      resolve(Service.successResponse(newPage));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error creating page',
        e.status || 500,
      ));
    }
  },
);

// Delete entry by id
const deletePageByPageId = ({ pageId }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const deletedPage = await googleSheetsService.deletePageByPageId(pageId);
      resolve(Service.successResponse(deletedPage));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error deleting page',
        e.status || 500,
      ));
    }
  },
);

// Get page by ID
const getCreatorPageById = ({ pageId }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const page = await googleSheetsService.getPageById(pageId);
      resolve(Service.successResponse(page));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error fetching page',
        e.status || 500,
      ));
    }
  },
);

// Logout user
const logoutUser = ({ pageId }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const logout = await googleSheetsService.logoutUser(pageId);
      resolve(Service.successResponse(logout));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error logging out user',
        e.status || 500,
      ));
    }
  },
);

// Update Link
const updateLinkByPageId = ({ pageId, link }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const updatedLink = await googleSheetsService.updateLinkByPageId(pageId, link);
      resolve(Service.successResponse(updatedLink));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error updating link',
        e.status || 500,
      ));
    }
  },
);

// Update Social-Link
const updateSocialLinkByPageId = ({ pageId, body }) => new Promise(
  // eslint-disable-next-line no-async-promise-executor
  async (resolve, reject) => {
    try {
      const updatedSocialLink = await googleSheetsService.updateSocialLinkByPageId(pageId, body);
      resolve(Service.successResponse(updatedSocialLink));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Error updating social link',
        e.status || 500,
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
