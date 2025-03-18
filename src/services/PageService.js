const Service = require('./Service');
const GoogleSheetsService = require('./GoogleSheetsService');

const getPageById = ({ pageId }) => new Promise(
    async (resolve, reject) => {
      try {
        const pages = await GoogleSheetsService.getPagesFromSheet();

        const page = pages.find(p => p.id === pageId);

        if (!page) {
          return reject(Service.rejectResponse(
              `Page with ID "${pageId}" not found.`,
              404
          ));
        }

        resolve(Service.successResponse(page));
      } catch (e) {
        reject(Service.rejectResponse(
            e.message || 'Something went wrong',
            e.status || 500
        ));
      }
    }
);

module.exports = {
  getPageById
};
