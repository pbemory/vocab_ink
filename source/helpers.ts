import { appendFileSync, createReadStream, createWriteStream, ReadStream } from 'fs';
import { parse, format } from 'fast-csv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//debug via Javascript Debug Terminal:
//node --loader ts-node/esm source/helpers.ts

export type ReadHistoryData = {
  wordsLearnedThisWeek: number,
  wordsRemaining: number,
}

export async function getReadHistory() {
  const filePath = path.join(__dirname, '../utils/status_db.csv');
  const readable = createReadStream(filePath, { encoding: 'utf8' });
  const rawHistoryData = await readRows(readable);
  readable.close();
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

export async function readRows(readable: ReadStream) {
  let data: any[] = [];
  for await (const row of readable.pipe(parse({ headers: false }))) {
    data.push(row);
  }
  return data;
}

export function getMostRecentSunday() {
  const today = new Date();
  const todayAsInt = today.getDay();
  const most_recent_sunday = (todayAsInt == 0) ? new Date(today.getFullYear(), today.getMonth(), today.getDate()).toLocaleDateString() : new Date(today.getFullYear(), today.getMonth(), today.getDate() - todayAsInt).toLocaleDateString();
  return most_recent_sunday;
}

export function addNewWordToWordBank(word: string) {
  const row = `${word},0\n`
  try {
    const filePath = path.join(__dirname, '../utils/word_bank.csv');
    appendFileSync(filePath, row);
  } catch (err) {
    console.error(err);
  }
}

//credit: Durstenfeldt shuffle
export function shuffleArray(array:any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}