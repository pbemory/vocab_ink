import React, { useState } from 'react';
import { Text, Box, useApp, Newline, render } from 'ink';
import TextInput from 'ink-text-input';

type ExampleProps = {
  rowCursor: number,
  setRowCursor: (rowCursor: number) => void,
  currentWordEx: string,
  setShowQuestion: (showQuestion: boolean) => void,
  currentWord: string,
  setCalledFromExample: (calledFromExample: boolean) => void,
  score: any,
  setUserSaved: (userSaved:boolean) => void
}

export default function Example({ rowCursor, setRowCursor, currentWordEx,  setShowQuestion, currentWord, setCalledFromExample, score, setUserSaved }: ExampleProps) {

  const { exit } = useApp();

  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    if (query === 'q') {
      setUserSaved(true);
    }
    else {
      setQuery('');
      setCalledFromExample(true);
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
            Answer {score.length}:
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