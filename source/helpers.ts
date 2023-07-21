import { appendFileSync, createReadStream } from 'fs';
import { parse } from 'fast-csv';
import path, { dirname } from 'path';

//debug via Javascript Debug Terminal:
// node --loader ts-node/esm source/helpers.ts

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
  const readHistoryData: ReadHistoryData = {
    wordsLearnedThisWeek: 0,
    wordsRemaining: 0
  }
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
        readHistoryData.wordsLearnedThisWeek = Number(row[1])
      } else if (rowCounter == 2) {
        readHistoryData.wordsRemaining = Number(row[1])
      }
      rowCounter++;
    })
    .on('end', (rowCount: any) => {
      //console.log(`Parsed ${rowCount} rows`);
      //console.log(rows[81484]?.postcode);

    });
    console.log(readHistoryData);
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
    //paths are relative to vocab_ink/
    appendFileSync('./utils/word_bank.csv', row);
  } catch (err) {
    console.error(err);
  }
}

launch();