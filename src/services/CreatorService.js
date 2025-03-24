const googleSheetsService = require('./GoogleSheetService');
const Service = require('./Service');

// Add entry
const createPage = async ({ body }) => {
  try {
    const {
      id,
      name,
      bio,
      img,
      socialLink,
      link,
    } = body;

    const newPage = await googleSheetsService.createPage({
      id,
      name,
      bio,
      img,
      socialLink,
      link,
    });

    return Service.successResponse(newPage);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error creating page',
      e.status || 500,
    );
  }
};

// Delete entry by pageId
const deletePageByPageId = async ({ pageId }) => {
  try {
    const deletedPage = await googleSheetsService.deletePageByPageId(pageId);
    return Service.successResponse(deletedPage);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error deleting page',
      e.status || 500,
    );
  }
};

// Get page by pageId
const getCreatorPageById = async ({ pageId }) => {
  try {
    const page = await googleSheetsService.getCreatorPageById(pageId);
    return Service.successResponse(page);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error fetching page',
      e.status || 500,
    );
  }
};

// Update Link by pageId
const updateLinkByPageId = async ({ pageId, link }) => {
  try {
    const page = await googleSheetsService.getCreatorPageById(pageId);

    if (!page) {
      return Service.rejectResponse(
        `No page found with id ${pageId}`,
        404,
      );
    }

    const updatedPage = await googleSheetsService.createPage({
      ...page,
      link, // overwrite with updated link
    });

    await googleSheetsService.deletePageByPageId(pageId);

    return Service.successResponse(updatedPage);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error updating link',
      e.status || 500,
    );
  }
};

// Update Social Link by pageId
const updateSocialLinkByPageId = async ({ pageId, socialLink }) => {
  try {
    const page = await googleSheetsService.getCreatorPageById(pageId);

    if (!page) {
      return Service.rejectResponse(
        `No page found with id ${pageId}`,
        404,
      );
    }

    const updatedPage = await googleSheetsService.createPage({
      ...page,
      socialLink, // overwrite with updated socialLink
    });

    await googleSheetsService.deletePageByPageId(pageId);

    return Service.successResponse(updatedPage);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error updating social link',
      e.status || 500,
    );
  }
};

module.exports = {
  createPage,
  deletePageByPageId,
  getCreatorPageById,
  updateLinkByPageId,
  updateSocialLinkByPageId,
};
