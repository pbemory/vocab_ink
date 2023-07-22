import { appendFileSync, createReadStream, ReadStream } from 'fs';
import { parse } from 'fast-csv';

//debug via Javascript Debug Terminal:
//node --loader ts-node/esm source/helpers.ts

export async function launch() {
  let getReadHistory = await readHistory();
  let readHistoryData: ReadHistoryData = getReadHistory;
  return readHistoryData;
}

export type ReadHistoryData = {
  wordsLearnedThisWeek: number,
  wordsRemaining: number,
}

export async function readHistory() {

  const readable = createReadStream('./utils/status_db.csv', { encoding: 'utf8' });
  const rawHistoryData = await readHistoryRows(readable);
  const mostRecentSunday = getMostRecentSunday();
  let rowCounter = 0;
  let checkedThisWeek = true;
  const readHistoryData: ReadHistoryData = {
    wordsLearnedThisWeek: 0,
    wordsRemaining: 0
  }
  rawHistoryData.forEach(row => {
    if (rowCounter == 0) {
      if (new Date(mostRecentSunday) > new Date(row[1])) {
        checkedThisWeek = false;
      }
    } else if (rowCounter == 1 && checkedThisWeek) {
      readHistoryData.wordsLearnedThisWeek = Number(row[1])
    } else if (rowCounter == 2) {
      readHistoryData.wordsRemaining = Number(row[1])
    }
    rowCounter++;
  });
  return readHistoryData;
}

async function readHistoryRows(readable: ReadStream) {
  let data: any[] = [];
  for await (const row of readable.pipe(parse({ headers: false }))) {
    data.push(row);
  }
  return data;
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