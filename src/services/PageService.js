const Service = require('./Service');
const GoogleSheetsService = require('./GoogleSheetService');

// eslint-disable-next-line no-async-promise-executor,consistent-return
const getPageById = ({ pageId }) => new Promise(async (resolve, reject) => {
  try {
    const pages = await GoogleSheetsService.readSheet(); // Get data from Google Sheets

    const page = pages.find((p) => p.id === pageId);

    if (!page) {
      return reject(Service.rejectResponse(`Page with ID "${pageId}" not found.`, 404));
    }

    resolve(Service.successResponse(page));
  } catch (error) {
    reject(Service.rejectResponse(error.message || 'Something went wrong', error.status || 500));
  }
});

module.exports = {
  getPageById,
};
