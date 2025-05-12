const Service = require('./Service');
const GoogleSheetsService = require('./GoogleSheetService');

const getPageByHandle = async ({ handle }) => {
  try {
    const page = await GoogleSheetsService.getPageByHandle(handle);

    if (!page) {
      return Service.rejectResponse(`Page with handle "${handle}" not found.`, 404);
    }

    return Service.successResponse(page);
  } catch (error) {
    return Service.rejectResponse(error.message || 'Something went wrong', error.status || 500);
  }
};

module.exports = {
  getPageByHandle,
};
