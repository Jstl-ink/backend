// eslint-disable-next-line import/no-extraneous-dependencies
const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../google-credentials.json'),
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

async function getAuthClient() {
  try {
    return await auth.getClient();
  } catch (error) {
    console.error('Error getting GoogleAuth client:', error);
    throw new Error('Authentication failed');
  }
}

const spreadsheetId = '1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8';

// Try to parse json, if wrong parmams return empty json
function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
}

// Helper: Get all data as array from objs
async function getAllPages() {
  const client = await getAuthClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const getRows = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'person1!A2:F',
  });

  const rows = getRows.data.values || [];

  return rows.map((row) => ({
    id: row[0] || '',
    name: row[1] || '',
    bio: row[2] || '',
    img: row[3] || '',
    socialLinks: parseJson(row[4]) || [],
    links: parseJson(row[5]) || [],
  }));
}

// add entry too page
async function createPage({
  id, name, bio, img, socialLinks, links,
}) {
  const client = await getAuthClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  await googleSheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'person1!A:F',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[id, name, bio, img, JSON.stringify(socialLinks), JSON.stringify(links)]],
    },
  });

  return { message: 'Row successfully added.' };
}

// Get Page by ID
async function getCreatorPageById(pageId) {
  const pages = await getAllPages();
  return pages.find((page) => page.id === pageId);
}

// Delete Page by ID
async function deletePageByPageId(pageId) {
  const client = await getAuthClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const pages = await getAllPages();
  const rowIndex = pages.findIndex((page) => page.id === pageId);

  if (rowIndex === -1) {
    throw new Error(`No page with id ${pageId} found.`);
  }

  await googleSheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `person1!A${rowIndex + 2}:F${rowIndex + 2}`,
  });

  return { message: `Page with ID ${pageId} successfully deleted.` };
}

// Update Link by Page ID
async function updateLinkByPageId(pageId, link) {
  const page = await getCreatorPageById(pageId);

  if (!page) throw new Error(`No page with id ${pageId} found.`);

  // Delete old entry
  await deletePageByPageId(pageId);

  // Create new entry with updated link
  return createPage({
    ...page,
    link, // overwrite with updated link
  });
}

// Update Social Link by Page ID
async function updateSocialLinkByPageId(pageId, socialLink) {
  const page = await getCreatorPageById(pageId);

  if (!page) throw new Error(`No page with id ${pageId} found.`);

  // Delete old entry
  await deletePageByPageId(pageId);

  // Create new entry with updated socialLink
  return createPage({
    ...page,
    socialLink, // overwrite with updated socialLink
  });
}

module.exports = {
  getCreatorPageById,
  createPage,
  deletePageByPageId,
  updateLinkByPageId,
  updateSocialLinkByPageId,
};
