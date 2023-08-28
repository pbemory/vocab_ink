import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useApp, Newline, render } from 'ink';
import TextInput from 'ink-text-input';
import { appendFileSync, createReadStream, createWriteStream, ReadStream } from 'fs';
import { parse, format } from 'fast-csv';
import { shuffleArray, readRows } from '../helpers.js';
import { WordResult, buildAxiosInstances, fetchDefinitionAndExample, wordnikApiBaseUrl, wordnikParams, wordsApiBaseUrl } from '../wordClient.js';
import Question from './Question.js';
import { AxiosInstance } from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function Exercise() {
  const { exit } = useApp();
  const wordBankRef = useRef<any[]>([]);

  const [rowCursor, setRowCursor] = useState(0);
  const [query, setQuery] = useState('');
  const [promptPreText, setPromptPreText] = useState('What words means');
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
      setCurrentWordEx(`'` + wordResults.example.substring(0, 50) + `'`);
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

  const handleSubmit = async () => {
    if (query === 'q') {
      //await save()
      exit();
    }
    else {
      setQuery('');
      setCurrentWordDef('loading...');
      setRowCursor(rowCursor + 1);
    }

  }

  return (
    <Question
      rowCursor={rowCursor}
      
    />
  );
}