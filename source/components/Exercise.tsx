import React, { useEffect, useRef, useState } from 'react';
import { createReadStream } from 'fs';
import { Text, Box } from 'ink';
import { shuffleArray, readRows } from '../helpers.js';
import { WordResult, buildAxiosInstances, fetchDefinitionAndExample } from '../wordClient.js';
import Question from './Question.js';
import { AxiosInstance } from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import Example from './Example.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function Exercise() {

  const oldWordBankRef = useRef<any[]>([]);
  const newWordBankRef = useRef<any[]>([]);
  const [showQuestion, setShowQuestion] = useState(true);
  const [rowCursor, setRowCursor] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordDef, setCurrentWordDef] = useState('loading...');
  const [currentWordEx, setCurrentWordEx] = useState('');
  const [score, setScore] = useState<string[]>([]);
  const [calledFromExample, setCalledFromExmaple] = useState(false);

  useEffect(() => {

    const getWordBank = async () => {
      const filePath = path.join(__dirname, '../../utils/word_bank.csv');
      const readable = createReadStream(filePath, { encoding: 'utf8' });
      let wordBankRows: any[] = await readRows(readable);
      //shuffle it
      oldWordBankRef.current = shuffleArray(wordBankRows);
      let currentWord: any;
      //every() row but neeed notion of resume from slice(rowCursor)
      let rowIndex = 0;
      const findFirstNewWord = (wordBankRow: any) => {
        if (wordBankRow[1] == '1') {
          newWordBankRef.current = [...newWordBankRef.current, wordBankRow];
          rowIndex++;
          return true;
        }
        else {
          currentWord = oldWordBankRef.current[rowIndex][0];
          setCurrentWord(currentWord);
          setRowCursor(rowIndex+1);
          return false;
        }
      }
      oldWordBankRef.current.every(findFirstNewWord);
  
      //get the word from the word bank + fetch def/example
      const wordInstances: AxiosInstance[] = buildAxiosInstances(currentWord);
      const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 150) + `'`);
      setCurrentWordEx(`'` + wordResults.example.substring(0, 150) + `'`);
    }
    getWordBank();

  }, [])

  useEffect(() => {
    //skip on first render
    if (calledFromExample) {
      //oldWordBankRef.current.slice(rowCursor).every()//
      const updateQuestion = async () => {
        const currentWord = oldWordBankRef.current[rowCursor][0];
        setCurrentWord(currentWord);
        const wordInstances: AxiosInstance[] = buildAxiosInstances(currentWord);
        const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
        setCurrentWordDef(`'` + wordResults.definition.substring(0, 150) + `'`);
        setCurrentWordEx(`'` + wordResults.example.substring(0, 150) + `'`);
      }
      updateQuestion();
    }
  }, [rowCursor])

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
          calledFromExample = {calledFromExample}
          setCalledFromExample = {setCalledFromExmaple}
          score={score}
        />
      )}
    </>
  );
}