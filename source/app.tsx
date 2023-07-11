import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';
import { launch, addWordToWordBank } from './helpers.js';
import { Text } from 'ink';

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
