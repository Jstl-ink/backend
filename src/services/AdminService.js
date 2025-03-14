/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get the admin site
* 
*
* pageId Long ID of order that needs to be fetched
* body File  (optional)
* returns String
* */
const getAdminPageById = ({ pageId, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        pageId,
        body,
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
  getAdminPageById,
};
