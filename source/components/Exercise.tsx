import React, { useEffect, useState } from 'react';
import { Text, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { appendFileSync, createReadStream, createWriteStream, ReadStream } from 'fs';
import { parse, format } from 'fast-csv';
import { shuffleArray, readRows } from '../helpers.js';
import { buildAxiosInstances, fetchDefinitionAndExample, wordnikApiBaseUrl,wordnikParams,wordsApiBaseUrl } from '../wordClient.js';
import { AxiosInstance } from 'axios';

export default function Exercise() {
  const { exit } = useApp();
  const [query, setQuery] = useState('');
  const [promptText, setPromptText] = useState('What words means');
  const [rowCursor, setRowCursor] = useState(0);


  useEffect(() => {
    //load the whole word bank
    const getWordBank = async () => {
      const readable = createReadStream('./utils/word_bank.csv', { encoding: 'utf8' });
      const wordBankRows = await readRows(readable);
      //shuffle it
      shuffleArray(wordBankRows);
      const testInstances: AxiosInstance[] = buildAxiosInstances(wordBankRows[0][0]);
      const testResults = await fetchDefinitionAndExample(testInstances);
      console.log(testResults);
      //send curRowcursor row
    }
    getWordBank();

  }, [])

  //another useEffect
  //dependency on questionResponse
  //concatenate row to some list thing
  // on save is when you actually write to file

  const handleSubmit = () => {
    if (query === 'q') {
      exit();
    }

    //else update questionResponse

    setQuery('');
    setRowCursor(rowCursor + 1);

  }

  return (
    <Box
      borderStyle="round"
      borderColor="green"
      width="75%"
    >
      <Box
        marginRight={1}
        marginLeft={1}
      >
        <Text
        >
          {promptText}{' '}
        </Text>
        <Text
          bold
          color="whiteBright"
        >
          '{rowCursor}'
        </Text>
        <Text>
          ?
        </Text>
      </Box>
      <TextInput
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}