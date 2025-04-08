const Service = require('./Service');
const GoogleSheetsService = require('./GoogleSheetService');

const getPageById = async ({ pageId }) => {
  try {
    const page = await GoogleSheetsService.getCreatorPageById(pageId);

    if (!page) {
      return Service.rejectResponse(`Page with ID "${pageId}" not found.`, 404);
    }

    return Service.successResponse(page);
  } catch (error) {
    return Service.rejectResponse(error.message || 'Something went wrong', error.status || 500);
  }
};

module.exports = {
  getPageById,
};
