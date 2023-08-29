import React, { useState } from 'react';
import { Text, Box, useApp, Newline, render } from 'ink';
import TextInput from 'ink-text-input';

type ExampleProps = {
  rowCursor: number,
  setRowCursor: (rowCursor: number) => void,
  currentWordEx: string,
  setCurrentWordEx: (currentWordDef: string) => void,
  showQuestion: boolean,
  setShowQuestion: (showQuestion: boolean) => void,
  currentWord: string
}

export default function Example({ rowCursor, setRowCursor, currentWordEx, setCurrentWordEx, showQuestion, setShowQuestion, currentWord }: ExampleProps) {

  const { exit } = useApp();

  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    if (query === 'q') {
      //await save()
      exit();
    }
    else {
      setQuery('');
      setRowCursor(rowCursor + 1);
      setShowQuestion(true);
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
            Answer {rowCursor + 1}:
          </Text>
          <Newline />
          <Text
            bold
            color="whiteBright"
          >
            {currentWord}
          </Text>
          <Text
          >
            :e.g.:
          </Text>
          <Text
            bold
            color="whiteBright"
          >
            {currentWordEx}
          </Text>
          <Text
            color="greenBright"
          >
            <Newline/>
            <Newline/>
            {'[Enter] to continue... '}
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