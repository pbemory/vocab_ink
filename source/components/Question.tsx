import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useApp, Newline, } from 'ink';
import TextInput from 'ink-text-input';


type QuestionProps = {
  rowCursor: number,
  setRowCursor: (rowCursor: number) => void,
  currentWordDef: string,
  setCurrentWordDef: (currentWordDef: string) => void,
  showQuestion: boolean,
  setShowQuestion: (showQuestion: boolean) => void,
  currentWord: string,
  score: any,
  setScore: (oldScore: any) => void,
}

export default function Question({ rowCursor, setRowCursor, currentWordDef, setCurrentWordDef, showQuestion, setShowQuestion, currentWord, score, setScore }: QuestionProps) {
  const { exit } = useApp();

  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    if (query === 'q') {
      //await save()
      exit();
    }
    else {
      setShowQuestion(false);
      setQuery('');
      setCurrentWordDef('loading...');
      if (query === currentWord) {
        setScore((score: any) => [...score, '✔️ '])
      }
      else {
        setScore((score: any) => [...score, '✖️ '])
      }
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
            color="gray"
          >
            Score:{score.map((point: any) => (point))}
          </Text>
          <Newline />
          <Text
            color="greenBright"
          >
            Question {rowCursor + 1}:
          </Text>
          <Newline />
          <Text
          >
            What word means{' '}
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