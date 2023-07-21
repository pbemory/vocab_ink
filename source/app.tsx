import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';
import { launch, addWordToWordBank } from './helpers.js';
import { Text, Box } from 'ink';

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
      <Box borderStyle="classic" width="25%" justifyContent="center">
        <Text>Words Added:</Text>
      </Box>
        {add?.map((word) => (
          <WordAdded
            word={word}
            key={word}
          />
        ))}
      </>
    )
  }
  else {
    // const mostRecentSunday = launch().toString();
    launch();
    return (
      <>
        {/* <Text>{mostRecentSunday}</Text> */}
      </>
    )
  }
}
