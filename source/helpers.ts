import { appendFileSync, createReadStream, createWriteStream, ReadStream } from 'fs';
import { parse, format } from 'fast-csv';

//debug via Javascript Debug Terminal:
//node --loader ts-node/esm source/helpers.ts


export async function runExercise(readHistory:ReadHistoryData){

}

export type ReadHistoryData = {
  wordsLearnedThisWeek: number,
  wordsRemaining: number,
}

export async function getReadHistory() {

  const readable = createReadStream('./utils/status_db.csv', { encoding: 'utf8' });
  const rawHistoryData = await readRows(readable);
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
    //paths are relative to vocab_ink/
    appendFileSync('./utils/word_bank.csv', row);
  } catch (err) {
    console.error(err);
  }
}

export function save(wordBankPath: string, wordsLearnedThisWeek: number, wordsRemaining: number) {
  const statusDBPath = './utils/status_db.csv';
  const writable = createWriteStream(statusDBPath, { encoding: 'utf8' });
  const stream = format({ headers:true });
  stream.pipe(writable);
  stream.write(["Date of last checked Sunday", String(getMostRecentSunday())]);
  stream.write(["Words learned since Sunday", String(wordsLearnedThisWeek)]);
  stream.write(["Words remaining", String(wordsRemaining)]);
  stream.end();
  //TODO: fs . replace _tmp with .csv
}

//credit: Durstenfeldt shuffle
export function shuffleArray(array:any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}