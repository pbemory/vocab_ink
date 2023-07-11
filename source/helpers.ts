import { appendFileSync, createReadStream } from 'fs';
import {parse} from 'fast-csv';
import path, {dirname} from 'path';

export function launch() {
  readHistory();
}

export function readHistory() {
  let rows: string[] = [];
  const mostRecentSunday = getMostRecentSunday();
  createReadStream(path.resolve(__dirname,'status_db.csv'))
  .pipe(parse({headers: false}))
  .on('error', error => console.error(error))
  .on('data', row => {
      console.log(row);
      //each row can be written to db
      rows.push(row);
  })
  .on('end', (rowCount: any) => {
      console.log(`Parsed ${rowCount} rows`);
      //console.log(rows[81484]?.postcode); // this data can be used to write to a db in bulk
  });

}

export function getMostRecentSunday() {
  const today = new Date();
  const todayAsInt = today.getDay();
  const most_recent_sunday = (todayAsInt == 0) ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() - todayAsInt).toLocaleDateString();
  return most_recent_sunday;
}

export function addWordToWordBank(word:string) {
  const row = `${word},0\n`
  try {
    //fs considers vocab_ink/ the current dir
    appendFileSync('../utils/word_bank.csv', row);
  } catch (err) {
    console.error(err);
  }
}