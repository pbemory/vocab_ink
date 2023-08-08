import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useApp, Newline } from 'ink';
import TextInput from 'ink-text-input';
import { appendFileSync, createReadStream, createWriteStream, ReadStream } from 'fs';
import { parse, format } from 'fast-csv';
import { shuffleArray, readRows } from '../helpers.js';
import { WordResult, buildAxiosInstances, fetchDefinitionAndExample, wordnikApiBaseUrl, wordnikParams, wordsApiBaseUrl } from '../wordClient.js';
import { AxiosInstance } from 'axios';


export default function Exercise() {
  const { exit } = useApp();
  const [query, setQuery] = useState('');
  const [promptPreText, setPromptPreText] = useState('What words means');
  const [currentWordDef, setCurrentWordDef] = useState('loading...');
  const [currentWordEx, setCurrentWordEx] = useState('');
  const [rowCursor, setRowCursor] = useState(0);
  const wordBankRef = useRef<any[]>([]);


  useEffect(() => {
    //load the whole word bank
    const getWordBank = async () => {
      const readable = createReadStream('./utils/word_bank.csv', { encoding: 'utf8' });
      let wordBankRows: any[] = await readRows(readable);
      //shuffle it
      wordBankRef.current = shuffleArray(wordBankRows);
      //get the word from the word bank + fetch def/example
      const wordInstances: AxiosInstance[] = buildAxiosInstances(wordBankRef.current[rowCursor][0]);
      const wordResults: WordResult = await fetchDefinitionAndExample(wordInstances);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 50) + `'`);
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
    <Box
      borderStyle="round"
      borderColor="green"
      width="100%"
    >
      <Box
        marginLeft={1}
      >
        <Text>
        <Text
          color="greenBright"
        >
          Question {rowCursor + 1}:
        </Text>
        <Newline/>
        <Text
        >
          {promptPreText}{' '}
        </Text>
        <Text
          bold
          color="whiteBright"
        >
          {currentWordDef}
        </Text>
        <Text>
          ?{' '}
        </Text>
        <TextInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
        />
        </Text>
      </Box>
    </Box>
  );
}