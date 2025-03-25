const googleSheetsService = require('./GoogleSheetService');
const Service = require('./Service');

// Add entry
const createPage = async ({ body }) => {
  try {
    const {
      id, name, bio, img, socialLinks, links,
    } = body;

    const formattedSocialLinks = Array.isArray(socialLinks) ? socialLinks : [];
    const formattedLinks = Array.isArray(links) ? links : [];

    const newPage = await googleSheetsService.createPage({
      id,
      name,
      bio,
      img,
      socialLinks: formattedSocialLinks,
      links: formattedLinks,
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
const updateLinkByPageId = async ({ pageId, links }) => {
  try {
    const page = await googleSheetsService.getCreatorPageById(pageId);
    if (!page) throw new Error(`No page with id ${pageId} found.`);

    const updatedPage = await googleSheetsService.updateLinkByPageId(pageId, links);

    return Service.successResponse(updatedPage);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error updating links',
      e.status || 500,
    );
  }
};

// Update social link by pageId
const updateSocialLinkByPageId = async ({ pageId, socialLinks }) => {
  try {
    const page = await googleSheetsService.getCreatorPageById(pageId);
    if (!page) throw new Error(`No page with id ${pageId} found.`);

    const updatedPage = await googleSheetsService.updateSocialLinkByPageId(pageId, socialLinks);

    return Service.successResponse(updatedPage);
  } catch (e) {
    return Service.rejectResponse(
      e.message || 'Error updating social links',
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
