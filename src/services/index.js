const CreatorService = require('./CreatorService');
const PageService = require('./PageService');
const express = require("express");
const { google } = require("googleapis");
const path = require("path");
const wasi = require("node:wasi");

const app = express();

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../../google-credentials.json"),
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  // Create client instance for auth
  const client = await auth.getClient();
//instance of Sheets API
  const googleSheets = google.sheets({version: "v4", auth: client});


  const spreadsheetId = "1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8";
  
  //Read rows from sheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range:"person1!A2:D"
  })

  //Write rows to sheet
  const writeRows = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "person1!A:D",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
          ["dummy","dummy","dummyPic","dummyLink"]
      ]
    }
  })
  console.log("DATA CREATED")

  res.send(getRows.data);
  console.log("DATA READ")

});





module.exports = {
  CreatorService,
  PageService,
};

// ✅ Listen-function
app.listen(8080, () => console.log("running on 8080"));
