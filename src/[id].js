import { google } from 'googleapis';
import {content} from "googleapis/build/src/apis/content";

//fetch data to frontend component(server-side)
export async function getServerSide({query}){
   //Auth
    const auth = await google.auth.getClient({scopes: ['https://docs.google.com/spreadsheets/d/1cZzTW0jtoVlOOElmxHsixPEWIPFGswGfC8z6234_Go8']});
    const sheets = google.sheets({version:'v4',auth});

    //Query
    const {id} =query;
    const range = `Sheet1!A${id}:C${id}`;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range,
    });

    return {
        props: {
            title,
            content
        }
    }
}

export default function Post({title, content}){
    return <article>
        <h1>{title}</h1>
        <div></div>
    </article>
}