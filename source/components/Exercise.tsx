import React, { useEffect, useRef, useState } from 'react';
import { createReadStream, createWriteStream } from 'fs';
import { stringify } from 'csv-stringify';
import { Text, Box, useApp } from 'ink';
import { shuffleArray, readRows, ReadHistoryData, getMostRecentSunday } from '../helpers.js';
import { WordResult, buildAxiosInstances, fetchDefinitionAndExample } from '../wordClient.js';
import Question from './Question.js';
import { AxiosInstance } from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import Example from './Example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function Exercise({ wordsLearnedThisWeek, wordsRemaining }: ReadHistoryData) {

  const oldWordBankRef = useRef<any[]>([]);
  const newWordBankRef = useRef<any[]>([]);
  const [showQuestion, setShowQuestion] = useState(true);
  const [rowCursor, setRowCursor] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordDef, setCurrentWordDef] = useState('loading...');
  const [currentWordEx, setCurrentWordEx] = useState('');
  const [score, setScore] = useState<number[]>([]);
  const [calledFromExample, setCalledFromExample] = useState(false);
  const [userSaved, setUserSaved] = useState(false);

  const { exit } = useApp();

  useEffect(() => {

    const getWordBank = async () => {
      const filePath = path.join(__dirname, '../../utils/word_bank.csv');
      const readable = createReadStream(filePath, { encoding: 'utf8' });
      let wordBankRows: any[] = await readRows(readable);
      readable.close();
      //shuffle it
      oldWordBankRef.current = shuffleArray(wordBankRows);
      let localWord: any;
      let rowIndex = 0;
      const findNewWord = (wordBankRow: any) => {
        if (wordBankRow[1].trim() == '1') {
          newWordBankRef.current = [...newWordBankRef.current, wordBankRow];
          rowIndex++;
          //console.log(wordBankRow[0] + " has a 1.")
          return true;
        }
        else {
          localWord = oldWordBankRef.current[rowIndex][0];
          setCurrentWord(localWord);
          setRowCursor(rowIndex);
          //console.log(wordBankRow[0] + " has a 0.")
          //console.log("We should be at element " + rowIndex);
          return false;
        }
      }
      oldWordBankRef.current.every(findNewWord);

      //get the word from the word bank + fetch def/example
      const wordInstances: AxiosInstance[] = buildAxiosInstances(localWord);
      const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 150) + `'`);
      setCurrentWordEx(`'` + wordResults.example.substring(0, 150) + `'`);
    }
    getWordBank();

  }, [])

  useEffect(() => {
    //skip on first render
    if (calledFromExample) {
      setCalledFromExample(false);
      //console.log("What is my score? " + score);
      //console.log("Did I get my last question right? " + score[score?.length - 1])
      if (score[score?.length - 1] === 0) {
        //console.log("Getting into truthiness");
        //console.log("This is the row I'm about to mark with 0 " + oldWordBankRef.current[rowCursor - 1])
        const copyWordRowToUpdate = [...oldWordBankRef.current[rowCursor - 1]]
        newWordBankRef.current = [...newWordBankRef.current, copyWordRowToUpdate];
      }
      else {
        //console.log("Getting into else.");
        //console.log("This is the row I'm about to mark with 1 " + oldWordBankRef.current[rowCursor - 1])
        const copyWordRowToUpdate = [...oldWordBankRef.current[rowCursor - 1]]
        copyWordRowToUpdate[1] = '1'
        newWordBankRef.current = [...newWordBankRef.current, copyWordRowToUpdate];
      }
      //console.log("Old word bank: " + oldWordBankRef.current.slice(0, rowCursor));
      //console.log("New word bank: " + newWordBankRef.current);

      const updateQuestion = async () => {

        let rowIndex = rowCursor;
        let localWord: any;

        const findNewWord = (wordBankRow: any) => {
          if (wordBankRow[1].trim() == '1') {
            newWordBankRef.current = [...newWordBankRef.current, wordBankRow];
            rowIndex++;
            return true;
          }
          else {
            //console.log("I found a word that is new. Is is: " + wordBankRow[0] + wordBankRow[1])
            localWord = oldWordBankRef.current[rowIndex][0];
            setCurrentWord(localWord);
            setRowCursor(rowIndex);
            return false;
          }
        }

        oldWordBankRef.current.slice(rowIndex).every(findNewWord);

        const wordInstances: AxiosInstance[] = buildAxiosInstances(localWord);
        const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
        setCurrentWordDef(`'` + wordResults.definition.substring(0, 150) + `'`);
        setCurrentWordEx(`'` + wordResults.example.substring(0, 150) + `'`);
      }
      updateQuestion();
    }
  }, [rowCursor])

  useEffect(() => {
    if (userSaved) {
      const save = async () => {
        const filePath = path.join(__dirname, '../../utils/word_bank.csv');
        const dbFilePath = path.join(__dirname, '../../utils/status_db.csv');
        const writeStream = createWriteStream(filePath, { encoding: 'utf8' });
        const dbWriteStream = createWriteStream(dbFilePath, { encoding: 'utf8' });
        const stringifier = stringify({ header: false });
        const dbStringifier = stringify({ header: false });
        //newWordBankRef.current.map((row) => stringifier.write(row));
        //oldWordBankRef.current.slice(rowCursor).map((row) => stringifier.write(row));
        let wordsRemaining = 0;
        for await(const row of newWordBankRef.current) {
          if(row[1].trim() == '0'){
            wordsRemaining++;
          }
          stringifier.write(row)
        }
        for await(const row of oldWordBankRef.current.slice(rowCursor)) {
          if(row[1].trim() == '0'){
            wordsRemaining++;
          }
          stringifier.write(row);
        }
        dbStringifier.write(["Date of last checked Sunday", String(getMostRecentSunday())])
        dbStringifier.write(["Words learned since Sunday", String(wordsLearnedThisWeek + score.filter(i => i == 1).length)])
        dbStringifier.write(["Words remaining",String(wordsRemaining)])

        stringifier.pipe(writeStream);
        dbStringifier.pipe(dbWriteStream);





      }
      save()
        .then(() => {
          exit();
        })
    }

  }, [userSaved])


  return (
    <>
      <Box
        borderStyle="round"
        borderColor="green"
        width="100%"
        justifyContent="center"
      >
        <Text
          bold
          color="greenBright"
        >
          EXERCISE:
        </Text>
      </Box>
      {showQuestion ? (
        <Question
          rowCursor={rowCursor}
          setRowCursor={setRowCursor}
          currentWordDef={currentWordDef}
          setCurrentWordDef={setCurrentWordDef}
          showQuestion={showQuestion}
          setShowQuestion={setShowQuestion}
          currentWord={currentWord}
          score={score}
          setScore={setScore}
          setUserSaved={setUserSaved}
        />
      ) : (
        <Example
          rowCursor={rowCursor}
          setRowCursor={setRowCursor}
          currentWordEx={currentWordEx}
          setCurrentWordEx={setCurrentWordEx}
          showQuestion={showQuestion}
          setShowQuestion={setShowQuestion}
          currentWord={currentWord}
          calledFromExample={calledFromExample}
          setCalledFromExample={setCalledFromExample}
          score={score}
          setUserSaved={setUserSaved}
        />
      )}
    </>
  );
}