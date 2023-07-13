import { appendFileSync, createReadStream } from 'fs';
import { parse } from 'fast-csv';
import path, { dirname } from 'path';

export function launch() {
  readHistory();
}

export type ReadHistoryData = {
  wordsLearnedThisWeek: number,
  wordsRemaining: number,
}

export function readHistory() {
  const mostRecentSunday = getMostRecentSunday();
  let rowCounter = 0;
  let checkedThisWeek = true;
  let wordsRemaining = 0
  createReadStream('./utils/status_db.csv')
    .pipe(parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', row => {
      if (rowCounter == 0) {
        if(new Date(mostRecentSunday) > new Date(row[1])) {
          const wordsLearnedThisWeek = 0
          checkedThisWeek = false;
        }
      } else if (rowCounter == 1 && checkedThisWeek) {
        const wordsLearnedThisWeek = Number(row[1])
      } else if (rowCounter == 2) {
        wordsRemaining = Number(row[1])
      }
      rowCounter++;
    })
    .on('end', (rowCount: any) => {
      //console.log(`Parsed ${rowCount} rows`);
      //console.log(rows[81484]?.postcode);
    });
    const readHistoryData: ReadHistoryData = {
      wordsLearnedThisWeek: wordsRemaining,
      wordsRemaining: wordsRemaining
    }
    return readHistoryData;
}

export function getMostRecentSunday() {
  const today = new Date();
  const todayAsInt = today.getDay();
  const most_recent_sunday = (todayAsInt == 0) ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() - todayAsInt).toLocaleDateString();
  return most_recent_sunday;
}

export function addWordToWordBank(word: string) {
  const row = `${word},0\n`
  try {
    //fs considers vocab_ink/ the current dir
    appendFileSync('./utils/word_bank.csv', row);
  } catch (err) {
    console.error(err);
  }
}