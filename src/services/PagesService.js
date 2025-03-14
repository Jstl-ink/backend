/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get page by pageId
* Returns a single page
*
* pageId Long ID of order that needs to be fetched
* returns String
* */
const getPageById = ({ pageId }) => new Promise(
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

module.exports = {
  getPageById,
};
