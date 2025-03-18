import { google } from 'googleapis';

export async function getServerSideProps({ query }) {
    const { id } = query;

    const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const SPREADSHEET_ID = process.env.SHEET_ID; // assigning sheet id from env-file

    // Which lines are read
    const range = `Sheet1!A${id}:C${id}`;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
        return {
            notFound: true,
        };
    }

    //specific row gets initialised data
    const [pageId, title, content] = rows[0];

    return {
        props: {
            pageId,
            title,
            content,
        },
    };
}

export default function Post({ pageId, title, content }) {
    return (
        <article>
            <h1>{title}</h1>
            <p>{content}</p>
            <p><small>Page ID: {pageId}</small></p>
        </article>
    );
}
