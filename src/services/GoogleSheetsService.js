const { google } = require('googleapis');
const path = require('path');

// Auth erstellen
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../google-credentials.json'), // dein Service Account JSON
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

// Sheet-ID aus deinem Link
const SPREADSHEET_ID = '1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8';

// adjust range to read rows
const RANGE = 'Sheet1!A2:E';

const getPagesFromSheet = async () => {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client});

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    });

    const rows = res.data.values;

    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return [];
    }

    // Beispiel: Wir mappen die Zeilen in Page-Objekte
    const pages = rows.map(row => {
        const [pageId, name, bio, img, linksJson] = row;

        let links = [];
        try {
            links = JSON.parse(linksJson);
        } catch (e) {
            console.warn('Links JSON parsing error:', e.message);
        }

        return {
            id: pageId,
            name: name || '',
            bio: bio || '',
            img: img || '',
            links: links || [],
        };
    });

    return pages;
};

module.exports = {
    getPagesFromSheet
};
