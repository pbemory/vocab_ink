import React, { useEffect, useRef, useState } from 'react';
import { createReadStream, createWriteStream } from 'fs';
import { stringify } from 'csv-stringify';
import { Text, Box, useApp } from 'ink';
import { shuffleArray, readRows, ReadHistoryData, getMostRecentSunday, save, updateWordBankFromScore } from '../helpers.js';
import { WordResult, buildAxiosInstances, fetchDefinitionAndExample, parseDefinitionAndExample } from '../wordClient.js';
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
      
      let wordBankRows: any[] = await readRows('../utils/word_bank.csv');
      //shuffle it
      oldWordBankRef.current = shuffleArray(wordBankRows);
      let localWord: any;
      let rowIndex = 0;
      const findNewWord = (wordBankRow: any) => {
        if (wordBankRow[1].trim() == '1') {
          newWordBankRef.current = [...newWordBankRef.current, wordBankRow];
          rowIndex++;
          return true;
        }
        else {
          localWord = oldWordBankRef.current[rowIndex][0];
          setCurrentWord(localWord);
          setRowCursor(rowIndex);
          return false;
        }
      }
      oldWordBankRef.current.every(findNewWord);
      //get the word from the word bank + fetch def/example
      const wordInstances: AxiosInstance[] = buildAxiosInstances(localWord);
      const rawWordResults = await fetchDefinitionAndExample(wordInstances);
      const wordResults = await parseDefinitionAndExample(rawWordResults);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 250) + `'`);
      setCurrentWordEx(`'` + wordResults.example.substring(0, 250) + `'`);
    }
    getWordBank();

  }, [])

  useEffect(() => {
    if (calledFromExample) {
      setCalledFromExample(false);
      updateWordBankFromScore(score,oldWordBankRef,newWordBankRef,rowCursor);
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
            localWord = oldWordBankRef.current[rowIndex][0];
            setCurrentWord(localWord);
            setRowCursor(rowIndex);
            return false;
          }
        }
        oldWordBankRef.current.slice(rowIndex).every(findNewWord);

        const wordInstances: AxiosInstance[] = buildAxiosInstances(localWord);
        const rawWordResults = await fetchDefinitionAndExample(wordInstances);
        const wordResults = await parseDefinitionAndExample(rawWordResults);
        setCurrentWordDef(`'` + wordResults.definition.substring(0, 250) + `'`);
        setCurrentWordEx(`'` + wordResults.example.substring(0, 250) + `'`);
      }
      updateQuestion();
    }
  }, [rowCursor])

  useEffect(() => {
    if (userSaved) {
      save(oldWordBankRef,newWordBankRef,wordsLearnedThisWeek,rowCursor,score)
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