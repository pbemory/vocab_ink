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

  const wordBankRef = useRef<any[]>([]);
  const [showQuestion, setShowQuestion] = useState(true);
  const [rowCursor, setRowCursor] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordDef, setCurrentWordDef] = useState('loading...');
  const [currentWordEx, setCurrentWordEx] = useState('');
  const [score, setScore] = useState<string[]>([]);

  useEffect(() => {

    const getWordBank = async () => {
      const filePath = path.join(__dirname, '../../utils/word_bank.csv');
      const readable = createReadStream(filePath, { encoding: 'utf8' });
      let wordBankRows: any[] = await readRows(readable);
      //shuffle it
      wordBankRef.current = shuffleArray(wordBankRows);
      //get the word from the word bank + fetch def/example
      const currentWord = wordBankRef.current[rowCursor][0];
      setCurrentWord(currentWord);
      const wordInstances: AxiosInstance[] = buildAxiosInstances(currentWord);
      const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 50) + `'`);
      setCurrentWordEx(`'` + wordResults.example.substring(0, 125) + `'`);
    }
    getWordBank();

  }, [])

  useEffect(() => {
    //skip on first render
    if (rowCursor > 0) {
      const updateQuestion = async () => {
        const currentWord = wordBankRef.current[rowCursor][0];
        setCurrentWord(currentWord);
        const wordInstances: AxiosInstance[] = buildAxiosInstances(currentWord);
        const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
        setCurrentWordDef(`'` + wordResults.definition.substring(0, 50) + `'`);
        setCurrentWordEx(`'` + wordResults.example.substring(0, 125) + `'`);
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
        />
      )}
    </>
  );
}