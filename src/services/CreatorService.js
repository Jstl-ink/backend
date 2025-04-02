/* eslint-disable no-unused-vars */
const { NotFound } = require('express-openapi-validator/dist/framework/types');
const Service = require('./Service');
const googleSheetsService = require('./GoogleSheetService');

/**
* Create new user page
*
* body PageIdRequestBody
* returns Page
* */
const createPage = ({ body }) => new Promise(
  async (resolve, reject) => {
    try {
      const { id } = body;
      const newPage = await googleSheetsService.createPage(id);

      resolve(Service.successResponse({
        newPage,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Create user page details
* Used to initialize user page with details - USE PATCH to actually update the details of user page
*
* pageId String ID of order that needs to be fetched
* body ImmutablePage
* returns Page
* */
const createPageDetailsByPageId = ({ pageId, body }) => new Promise(
  async (resolve, reject) => {
    try {
      const page = await googleSheetsService.getCreatorPageById(pageId);

      if (!page) {
        reject(Service.rejectResponse(
          `No page found with id ${pageId}`,
          404,
        ));
      }

      const updatedPage = await googleSheetsService.createPage({
        ...page,
        ...body, // overwrite with updated page details
      });

      await googleSheetsService.deletePageByPageId(pageId);

      resolve(Service.successResponse({
        updatedPage,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete a user page
*
* pageId String ID of order that needs to be fetched
* no response value expected for this operation
* */
const deletePageByPageId = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      const deletedPage = await googleSheetsService.deletePageByPageId(pageId);

      resolve(Service.successResponse({
        deletedPage,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get the creator page
*
* pageId String ID of order that needs to be fetched
* returns Page
* */
const getCreatorPageById = ({ pageId }) => new Promise(
  async (resolve, reject) => {
    try {
      const page = await googleSheetsService.getCreatorPageById(pageId);

      resolve(Service.successResponse({
        page,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update details of user page
*
* pageId String ID of order that needs to be fetched
* body ImmutablePage
* returns Link
* */
const updatePageDetailsByPageId = ({ pageId, body }) => new Promise(
  async (resolve, reject) => {
    try {
      const page = await googleSheetsService.getCreatorPageById(pageId);

      if (!page) throw new NotFound({ path: `${pageId}`, message: `No page with id ${pageId} found.` });

      const updatedPage = await googleSheetsService.createPage({
        ...page,
        ...body, // overwrite with updated page details
      });

      await googleSheetsService.deletePageByPageId(pageId);

      resolve(Service.successResponse({
        updatedPage,
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
  createPage,
  createPageDetailsByPageId,
  deletePageByPageId,
  getCreatorPageById,
  updatePageDetailsByPageId,
};
