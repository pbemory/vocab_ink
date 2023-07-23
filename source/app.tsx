import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';
import { launch, addWordToWordBank, ReadHistoryData } from './helpers.js';
import { Text, Box, Newline } from 'ink';
import HistoryDataDisplay from './components/HistoryDataDisplay.js';

let getReadHistory = await launch();

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  if (add && add.length > 0) {
    {
      add?.map((word) => {
        addWordToWordBank(word);
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
                />
            ))}
          </Text>
        </Box>
      </>
    )
  }
  else {
    let readHistoryData: ReadHistoryData = getReadHistory;
    return (
      <>
        <HistoryDataDisplay {...readHistoryData} />
      </>
    )
  }
}
