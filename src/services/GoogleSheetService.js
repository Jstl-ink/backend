const express = require("express");
const { google } = require("googleapis");
const path = require("path");
const CreatorService = require('./CreatorService');
const PageService = require('./PageService');

const app = express();
// Enable JSON-Parsing
app.use(express.json());

// Google Sheets Auth Setup
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../../google-credentials.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// function to get auth of client
async function getAuthClient() {
    try {
        return await auth.getClient();
    } catch (error) {
        console.error("Error getting GoogleAuth client:", error);
        throw new Error("Authentication failed");
    }
}

// GET-Endpoint e.g ({URL}/<searchterm>)
app.get("/:searchTerm", async (req, res) => {
    const searchTerm = req.params.searchTerm.toLowerCase(); // get search term from the URL

    try {
        const client = await getAuthClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });
        const spreadsheetId = "1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8";

        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "person1!A2:E",
        });

        const rows = getRows.data.values;

        if (!rows || rows.length === 0) {
            return res.status(404).send("No data found.");
        }

        // Search for all occurrences of the search term across all columns
        const foundRows = rows.filter((row) => {
            // Convert each row field to lowercase and check if it includes the search term
            return row.some((field) => field.toLowerCase().includes(searchTerm));
        });

        if (foundRows.length === 0) {
            return res.status(404).send(`No matches found for '${searchTerm}'.`);
        }

        // Return all matching rows
        const result = foundRows.map((row) => ({
            id: row[0],
            firstname: row[1],
            lastname: row[2],
            picture: row[3],
            link: row[4],
        }));

        res.json(result);
    } catch (error) {
        console.error("Error when trying to access the sheet:", error);
        res.status(500).send("Server Error");
    }
});

// POST-Endpoint ({URL}/add) --> test via postman wirh "RAW"- body input in json-format
app.post("/add", async (req, res) => {
    const { id, firstname, lastname, picture, link } = req.body;  // Destructure the data from the POST request body

    // Check if all required fields are provided
    if (!id || !firstname || !lastname || !picture || !link) {
        return res.status(400).send("Missing required fields.");
    }

    try {
        const client = await getAuthClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });
        const spreadsheetId = "1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8";

        // Add the new row to the sheet
        const appendResponse = await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "person1!A:E",  // Assuming we are writing to columns A to E (id, firstname, lastname, picture, link)
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [id, firstname, lastname, picture, link]  // The new row to be added
                ]
            }
        });

        // Respond with success message
        res.status(201).send("Row successfully added.");
    } catch (error) {
        console.error("Error when trying to access the sheet:", error);
        res.status(500).send("Server Error");
    }
});

// DELETE-Endpoint ({URL}/delete/<id>)
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;  // get ID from URL

    try {
        const client = await getAuthClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });
        const spreadsheetId = "1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8";

        // Get all rows
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: "person1!A2:E"
        });

        const rows = getRows.data.values;

        if (!rows || rows.length === 0) {
            return res.status(404).send("No data found.");
        }

        // Search for specific row
        const rowIndex = rows.findIndex((row) => row[0] === id);

        if (rowIndex === -1) {
            return res.status(404).send(`No row with id ${id} found.`);
        }

        // Delete row (using clear instead of deleting entire row)
        const deleteResponse = await googleSheets.spreadsheets.values.clear({
            auth,
            spreadsheetId,
            range: `person1!A${rowIndex + 2}:E${rowIndex + 2}`,  // rowindex+2 to get correct table start to find specific row
        });

        res.status(200).send(`Row with ID ${id} successfully deleted.`);
    } catch (error) {
        console.error("Error when trying to access the sheet:", error);
        res.status(500).send("Server Error");
    }
});

// Server starten
app.listen(8080, () => console.log("Running on port 8080"));
