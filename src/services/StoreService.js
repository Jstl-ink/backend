/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Returns pet inventories by status
* Returns a map of status codes to quantities
*
* returns Map
* */
const getInventory = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
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
  getInventory,
};
