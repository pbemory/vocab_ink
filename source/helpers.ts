import { appendFileSync, createReadStream, createWriteStream, ReadStream } from 'fs';
import { parse, format } from 'fast-csv';
import { stringify } from 'csv-stringify';
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
  const rawHistoryData = await readRows('../utils/status_db.csv');
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

export async function readRows(filepath: string) {
  const filePath = path.join(__dirname, filepath);
  const readable = createReadStream(filePath, { encoding: 'utf8' });
  let data: any[] = [];
  for await (const row of readable.pipe(parse({ headers: false }))) {
    data.push(row);
  }
  readable.close()
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

export function updateWordBankFromScore(score: number[], oldWordBankRef: any, newWordBankRef: any, rowCursor: any) {
  if (score[score?.length - 1] === 0) {
    const copyWordRowToUpdate = [...oldWordBankRef.current[rowCursor - 1]]
    newWordBankRef.current = [...newWordBankRef.current, copyWordRowToUpdate];
  }
  else {
    const copyWordRowToUpdate = [...oldWordBankRef.current[rowCursor - 1]]
    copyWordRowToUpdate[1] = '1'
    newWordBankRef.current = [...newWordBankRef.current, copyWordRowToUpdate];
  }
}

export async function save(oldWordBankRef: any, newWordBankRef: any, wordsLearnedThisWeek: any, rowCursor: any, score: any) {
  const filePath = path.join(__dirname, '../utils/word_bank.csv');
  const dbFilePath = path.join(__dirname, '../utils/status_db.csv');
  const writeStream = createWriteStream(filePath, { encoding: 'utf8' });
  const dbWriteStream = createWriteStream(dbFilePath, { encoding: 'utf8' });
  const stringifier = stringify({ header: false });
  const dbStringifier = stringify({ header: false });
  let wordsRemaining = 0;
  for await (const row of newWordBankRef.current) {
    if (row[1].trim() == '0') {
      wordsRemaining++;
    }
    stringifier.write(row)
  }
  for await (const row of oldWordBankRef.current.slice(rowCursor)) {
    if (row[1].trim() == '0') {
      wordsRemaining++;
    }
    stringifier.write(row);
  }
  dbStringifier.write(["Date of last checked Sunday", String(getMostRecentSunday())])
  dbStringifier.write(["Words learned since Sunday", String(wordsLearnedThisWeek + score.filter((i: any) => i == 1).length)])
  dbStringifier.write(["Words remaining", String(wordsRemaining)])

  stringifier.pipe(writeStream);
  dbStringifier.pipe(dbWriteStream);

}

//credit: Durstenfeldt shuffle
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}