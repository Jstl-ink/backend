// eslint-disable-next-line import/no-extraneous-dependencies
const { google } = require('googleapis');
const path = require('path');
const { NotFound } = require('express-openapi-validator/dist/framework/types');

// Set up Google authentication
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../google-credentials.json'),
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
async function createPage(body) {
  const {
    id = '',
    name = '',
    bio = '',
    img = '',
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

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'person1!A2:F',
  });

  return { message: `Page with ID ${pageId} successfully deleted.` };
}

module.exports = {
  getCreatorPageById,
  createPage,
  deletePageByPageId,
};
