import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';
import Exercise from './components/Exercise.js';
import ExerciseYN from './components/ExerciseYN.js';
import { getReadHistory, addNewWordToWordBank, ReadHistoryData } from './helpers.js';
import { Text, Box, render } from 'ink';
import ReadHistoryDisplay from './components/ReadHistoryDisplay.js';

let readHistory: ReadHistoryData = await getReadHistory();

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  if (add && add.length > 0) {
    {
      add?.map((word) => {
        addNewWordToWordBank(word);
      })
    }
    return (
      <>
        <Box
          borderStyle="round"
          borderColor="green"
          width="75%"
          justifyContent="center"
        >
          <Text
            bold
            color="greenBright"
          >
            WORDS ADDED:
          </Text>
        </Box>
        <Box
          borderStyle="round"
          borderColor="green"
          width="75%"
          justifyContent="center"
        >
          <Text>
            {add?.map((word) => (
              <WordAdded
                word={word}
                key={word}
                lastWord={add[add.length - 1]}
              />
            ))}
          </Text>
        </Box>
        <ExerciseYN/>
      </>
    )
  }
  else {
    return (
      <>
        <ReadHistoryDisplay {...readHistory} />
        <Exercise/>
      </>
    )
  }
}
