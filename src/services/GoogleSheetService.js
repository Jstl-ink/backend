// eslint-disable-next-line import/no-extraneous-dependencies
const { google } = require('googleapis');
const { NotFound } = require('express-openapi-validator/dist/framework/types');
const { getRandomProfileImage } = require('./UnsplashService');

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

const spreadsheetId = '1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8';

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
    range: 'person1!A2:F',
  });

  const rows = result.data.values || [];

  return rows.map((row) => ({
    id: row[0] || '',
    name: row[1] || '',
    bio: row[2] || '',
    img: row[3] || '',
    socialLinks: parseJson(row[4]),
    links: parseJson(row[5]),
  }));
}

/**
 * Fetches a single page by ID
 * @param {string} pageId - ID of the page to fetch
 * @returns {Promise<Object|null>} Page object or null if not found
 */
async function getCreatorPageById(pageId) {
  const pages = await getAllPages();
  return pages.find((page) => page.id === pageId);
}

/**
 * Appends a new page to the spreadsheet
 * @param {Object} body - Page data to insert
 * @param {string} [body.id] - Page ID
 * @param {string} [body.name] - Page name
 * @param {string} [body.bio] - Page bio
 * @param {string} [body.img] - Image reference
 * @param {Array} [body.socialLinks] - Social links array
 * @param {Array} [body.links] - Additional links array
 * @returns {Promise<Object>} Success message and updated range
 * @throws {Error} If creation fails
 */

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
    range: 'person1!A2:F',
  });

  const rows = response.data.values || [];

  // 2. Filter out empty rows
  const nonEmptyRows = rows.filter((row) => row.some((cell) => cell && cell.toString().trim() !== ''));
  // 3. Clear entire data range
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'person1!A2:F',
  });

  // 4. Write back non-empty rows
  if (nonEmptyRows.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'person1!A2:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: nonEmptyRows },
    });
  }

  return { message: 'Sheet compacted successfully' };
}

async function createPage(body) {
  const {
    id = '',
    name = '',
    bio = '',
    img = await getRandomProfileImage(),
    socialLinks = [],
    links = [],
  } = body || {};

  const row = [
    id,
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
      range: 'person1!A2:F',
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
  const rowIndex = pages.findIndex((page) => page.id === pageId);

  if (rowIndex === -1) {
    throw new NotFound({
      path: `${pageId}`,
      message: `No page with id ${pageId} found.`,
    });
  }

  const range = `person1!A${rowIndex + 2}:F${rowIndex + 2}`;

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

  console.log('Starting update for pageId:', pageId);

  try {
    // 1. Get all data to find the correct row
    const data = await getAllPages();
    console.log('Current sheet data:', data);

    const rowIndex = data.findIndex((row) => row.id === pageId);
    if (rowIndex === -1) {
      throw new NotFound({ message: `Page ${pageId} not found` });
    }

    // 2. Calculate exact range (A2:F2 for first data row)
    const range = `person1!A${rowIndex + 2}:F${rowIndex + 2}`;
    console.log('Calculated update range:', range);

    // 3. Prepare update data
    const currentRow = data[rowIndex];
    const updatedRow = [
      pageId,
      body.name || currentRow[1],
      body.bio || currentRow[2],
      body.img || currentRow[3],
      body.socialLinks ? JSON.stringify(body.socialLinks) : currentRow[4],
      body.links ? JSON.stringify(body.links) : currentRow[5],
    ];

    console.log('Update payload:', updatedRow);

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [updatedRow] },
    });

    await compactSheet();
    console.log('Update successful:', response.data);
    return { message: 'Page updated successfully' };
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
}

module.exports = {
  getCreatorPageById,
  createPage,
  deletePageByPageId,
  updatePage,
};
