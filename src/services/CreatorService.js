/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get the creator site
* 
*
* pageId Long ID of order that needs to be fetched
* body File  (optional)
* returns String
* */
const getCreatorPageById = ({ pageId, body }) => new Promise(
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
  getCreatorPageById,
};
