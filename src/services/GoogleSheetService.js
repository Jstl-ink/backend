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

// Get all data
async function readSheet() {
  const client = await getAuthClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'person1!A2:E',
  });

  const rows = getRows.data.values || [];

  return rows.map((row) => ({
    id: row[0],
    firstname: row[1],
    lastname: row[2],
    picture: row[3],
    link: row[4],
  }));
}

// Add entry to sheet
async function writeSheet({
  id, firstname, lastname, picture, link,
}) {
  const client = await getAuthClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'person1!A:E',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[id, firstname, lastname, picture, link]],
    },
  });

  return { message: 'Row successfully added.' };
}

// Delete entry by id
async function deleteFromSheet(id) {
  const client = await getAuthClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: 'person1!A2:E',
  });

  const rows = getRows.data.values;
  const rowIndex = rows.findIndex((row) => row[0] === id);

  if (rowIndex === -1) {
    throw new Error(`No row with id ${id} found.`);
  }

  await googleSheets.spreadsheets.values.clear({
    auth,
    spreadsheetId,
    range: `person1!A${rowIndex + 2}:E${rowIndex + 2}`,
  });

  return { message: `Row with ID ${id} successfully deleted.` };
}

// Find page by id
async function findPageById(pageId) {
  const pages = await readSheet();
  return pages.find((page) => page.id === pageId);
}

// Update link
async function updateLink({
  id, firstname, lastname, picture, link,
}) {
  await deleteFromSheet(id); // delete entry
  await writeSheet({
    id, firstname, lastname, picture, link,
  }); // add new entry with updated link
  return { message: `Row with ID ${id} successfully updated.` };
}

// Update socialLink
async function updateSocialLink({
  id, firstname, lastname, picture, socialLink,
}) {
  return updateLink({
    id, firstname, lastname, picture, socialLink,
  });
}

// logout user
async function logout(pageId) {
  try {
    const client = await getAuthClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    // eslint-disable-next-line no-shadow
    const spreadsheetId = '1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8';

    // get all rows
    const getRows = await googleSheets.spreadsheets.values.get({
      auth: client,
      spreadsheetId,
      range: 'person1!A2:F', // F-column is the login-status
    });

    const rows = getRows.data.values;

    if (!rows || rows.length === 0) {
      throw new Error('No data found.');
    }

    // Index der Zeile mit der passenden pageId finden
    const rowIndex = rows.findIndex((row) => row[0] === pageId);

    if (rowIndex === -1) {
      throw new Error(`No row with pageId ${pageId} found.`);
    }

    // log out user
    const updateResponse = await googleSheets.spreadsheets.values.update({
      auth: client,
      spreadsheetId,
      range: `person1!F${rowIndex + 2}`, // get to login column
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['FALSE']],
      },
    });

    console.log(`User ${pageId} has been logged out.`);

    return {
      message: `User ${pageId} successfully logged out.`,
      result: updateResponse.data,
    };
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed');
  }
}

module.exports = {
  readSheet,
  writeSheet,
  deleteFromSheet,
  findPageById,
  updateLink,
  updateSocialLink,
  logout,
};
