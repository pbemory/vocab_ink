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
  setUserSaved: (userSaved:boolean) => void
}

export default function Question({ rowCursor, setRowCursor, currentWordDef, setCurrentWordDef, showQuestion, setShowQuestion, currentWord, score, setScore, setUserSaved}: QuestionProps) {


  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    if (query === 'q') {
      setUserSaved(true);
    }
    else {
      setShowQuestion(false);
      setQuery('');
      setCurrentWordDef('loading...');
      if (query === currentWord) {
        setScore((score: any) => [...score, 1])
      }
      else {
        setScore((score: any) => [...score, 0])
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
          >
            Score:{score.map((point: any, index:any) => (
              <Text
              color={point === 1 ? 'green': 'red'}
              key={index}
              >
                {point === 1 ? ' \u2714' : ' \u2717'}
              </Text>
            ))}
          </Text>
          <Newline />
          <Text
            color="greenBright"
          >
            Question {score.length + 1}:
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