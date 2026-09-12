// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({ path: ['../../.env'] });
const { google } = require('googleapis');
const { NotFound, BadRequest } = require('express-openapi-validator/dist/framework/types');
const crypto = require('crypto');

const spreadsheetId = process.env.SPREADSHEET_ID;

// Encode google credentials with this
// const buffer = Buffer.from('');
// const encodedKeyStr = buffer.toString('base64');
// console.log('Base64 Encoded Key:', encodedKeyStr);

const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);

// Set up Google authentication
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const getHashedId = (id) => crypto.createHash('sha256').update(id).digest('hex');

/**
 * Gets authenticated Google API client
 * @returns {Promise<google.auth.GoogleAuth>} Authenticated client
 * @throws {Error} If authentication fails
 */
async function getAuthClient() {
  try {
    return await auth.getClient();
  } catch (error) {
    console.error('Error getting GoogleAuth client:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Safely parses JSON values
 * @param {string} value - JSON string to parse
 * @returns {Array|Object} Parsed JSON or empty array if invalid
 */
function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch (err) {
    return [];
  }
}

/**
 * Fetches all entries from the spreadsheet
 * @returns {Promise<Array>} Array of page objects
 */
async function getAllPages() {
  const client = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'person1!A2:G',
  });

  const rows = result.data.values || [];

  return rows.map((row) => ({
    id: row[0] || '',
    handle: row[1],
    name: row[2] || '',
    bio: row[3] || '',
    img: row[4] || '',
    socialLinks: parseJson(row[5]),
    links: parseJson(row[6]),
  }));
}

/**
 * Fetches a single page by handle
 * @param {string} handle - handle of the page to fetch
 * @returns {Promise<Object|null>} Page object or null if not found
 */
async function getPageByHandle(handle) {
  const pages = await getAllPages();
  return pages.find((page) => page.handle === handle);
}

/**
 * Fetches a single page by id
 * @param {string} pageId - pageId of the page to fetch
 * @returns {Promise<Object|null>} Page object or null if not found
 */
async function getCreatorPageById(pageId) {
  const pages = await getAllPages();
  const hashedId = getHashedId(pageId);
  return pages.find((page) => page.id === hashedId);
}


/**
 * Compacts the sheet by removing empty rows and shifting data up
 * @returns {Promise<Object>} Success message
 */
async function compactSheet() {
  const client = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  // 1. Get all data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'person1!A2:G',
  });

  const rows = response.data.values || [];

  // 2. Filter out empty rows
  const nonEmptyRows = rows.filter((row) => row.some((cell) => cell && cell.toString().trim() !== ''));
  // 3. Clear entire data range
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'person1!A2:G',
  });

  // 4. Write back non-empty rows
  if (nonEmptyRows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'person1!A2:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: nonEmptyRows },
    });
  }

  return { message: 'Sheet compacted successfully' };
}


/**
 * Appends a new page to the spreadsheet
 * @param {Object} body - Page data to insert
 * @param {string} [body.id] - Page ID
 * @param {string} [body.handle] - Page handle
 * @param {string} [body.name] - Page name
 * @param {string} [body.bio] - Page bio
 * @param {string} [body.img] - Image reference
 * @param {Array} [body.socialLinks] - Social links array
 * @param {Array} [body.links] - Additional links array
 * @returns {Promise<Object>} Success message and updated range
 * @throws {Error} If creation fails
 */
async function createPage(body) {
  const {
    id = '',
    handle = '',
    name = '',
    bio = '',
    img = '',
    socialLinks = [],
    links = [],
  } = body || {};

  if (await getPageByHandle(handle)) {
    throw new BadRequest({
      path: `${handle}`,
      message: `Page with handle ${handle} already exists.`,
      overrideStatus: 409,
    });
  }

  const hashedId = getHashedId(id);
  const row = [
    hashedId,
    handle,
    name,
    bio,
    img,
    JSON.stringify(socialLinks),
    JSON.stringify(links),
  ];

  const client = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'person1!A2:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });

    return {
      message: 'Page created successfully',
      range: response.data.updates.updatedRange,
    };
  } catch (error) {
    console.error('Error creating page:', error);
    throw new Error('Failed to create page');
  }
}

/**
 * Deletes a page by ID
 * @param {string} pageId - ID of the page to delete
 * @returns {Promise<Object>} Success message
 * @throws {NotFound} If page not found
 */
async function deletePageByPageId(pageId) {
  const client = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const pages = await getAllPages();
  const hashedId = getHashedId(pageId);
  const { rowIndex, currentRow } = await findRowByPageId(pageId);

  if (rowIndex === -1) {
    throw new NotFound({
      path: `${pageId}`,
      message: `No page with id ${pageId} found.`,
    });
  }

  const range = `person1!A${rowIndex + 2}:G${rowIndex + 2}`;

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
  await compactSheet();
  return { message: `Page with ID ${pageId} successfully deleted.` };
}

/**
 * Updates an existing page in the spreadsheet
 * @param {string} pageId - ID of the page to update
 * @param {Object} body - Updated page data
 * @returns {Promise<Object>} Success message
 */
async function updatePage(pageId, body) {
  const client = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const hashedId = getHashedId(pageId);

  // find row and get existing data
  const { rowIndex, currentRow } = await findRowByPageId(pageId);

  if (rowIndex === -1) {
    throw new NotFound({ message: `Page ${pageId} not found` });
  }

  // prepare updated data, safely handling arrays and empty values
  const updatedRow = [
    currentRow.id,
    currentRow.handle,
    body.name ?? currentRow.name ?? '',
    body.bio ?? currentRow.bio ?? '',
    body.img ?? currentRow.img ?? '',
    JSON.stringify(body.socialLinks ?? currentRow.socialLinks ?? []),
    JSON.stringify(body.links ?? currentRow.links ?? []),
  ];

  // execute update
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `person1!A${rowIndex + 2}:G${rowIndex + 2}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [updatedRow] },
  });

  return { message: 'Page updated successfully' };
}


async function findRowByPageId(pageId) {
  const client = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const hashedId = getHashedId(pageId);

  // Annahme: IDs sind in Spalte A (Anpassen falls nötig)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'person1!A2:A', // Nur IDs laden (schneller)
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === hashedId);

  if (rowIndex === -1) return { rowIndex: -1 };

  // Lade nur die eine Zeile (nicht alle Daten)
  const rowData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `person1!A${rowIndex + 2}:G${rowIndex + 2}`,
  });

  const currentRow = {
    id: rowData.data.values[0][0],
    handle: rowData.data.values[0][1],
    name: rowData.data.values[0][2],
    bio: rowData.data.values[0][3],
    img: rowData.data.values[0][4],
    socialLinks: parseJson(rowData.data.values[0][5]),
    links: parseJson(rowData.data.values[0][6]),
  };

  return { rowIndex, currentRow };
}

module.exports = {
  getCreatorPageById,
  getPageByHandle,
  createPage,
  deletePageByPageId,
  updatePage,
};
