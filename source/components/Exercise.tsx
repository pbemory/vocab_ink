import React, { useEffect, useRef, useState } from 'react';
import { createReadStream} from 'fs';
import { shuffleArray, readRows } from '../helpers.js';
import { WordResult, buildAxiosInstances, fetchDefinitionAndExample} from '../wordClient.js';
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
  const [currentWordDef, setCurrentWordDef] = useState('loading...');
  const [currentWordEx, setCurrentWordEx] = useState('');

  useEffect(() => {

    const getWordBank = async () => {
      const filePath = path.join(__dirname, '../../utils/word_bank.csv');
      const readable = createReadStream(filePath, { encoding: 'utf8' });
      let wordBankRows: any[] = await readRows(readable);
      //shuffle it
      wordBankRef.current = shuffleArray(wordBankRows);
      //get the word from the word bank + fetch def/example
      const wordInstances: AxiosInstance[] = buildAxiosInstances(wordBankRef.current[rowCursor][0]);
      const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 50) + `'`);
      setCurrentWordEx(`'` + wordResults.example.substring(0, 75) + `'`);
    }
    getWordBank();

  }, [])

  useEffect(() => {
    //skip on first render
    if (rowCursor > 0) {
      const updateQuestion = async () => {
        const wordInstances: AxiosInstance[] = buildAxiosInstances(wordBankRef.current[rowCursor][0]);
        const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
        setCurrentWordDef(`'` + wordResults.definition.substring(0, 50) + `'`);
        setCurrentWordEx(`'` + wordResults.example.substring(0, 50) + `'`);
      }
      updateQuestion();
    }
  }, [rowCursor])

  return (
    <>
    {showQuestion ? (
    <Question
      rowCursor={rowCursor}
      setRowCursor={setRowCursor}
      currentWordDef={currentWordDef}
      setCurrentWordDef={setCurrentWordDef}
      showQuestion={showQuestion}
      setShowQuestion={setShowQuestion}
    />
    ) : (
      <Example
      rowCursor={rowCursor}
      setRowCursor={setRowCursor}
      currentWordEx={currentWordEx}
      setCurrentWordEx={setCurrentWordEx}
      showQuestion={showQuestion}
      setShowQuestion={setShowQuestion}
      />
    )}
    </>
  );
}