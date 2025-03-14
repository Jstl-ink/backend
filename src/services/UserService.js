/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Logs out current logged in user session
* 
*
* no response value expected for this operation
* */
const logoutUser = () => new Promise(
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
  logoutUser,
};
