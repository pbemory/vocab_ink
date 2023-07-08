import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';
import { launch } from './helpers.js';
import { Text } from 'ink';

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  if (add && add.length > 0) {
    {
      add?.map((word) => {
        const row = `${word},0\n`
        try {
          //fs considers vocab_ink/ the current dir
          appendFileSync('../word_bank.csv', row);
        } catch (err) {
          console.error(err);
        }
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
    const mostRecentSunday = launch().toString();
    return (
      <>
        <Text>{mostRecentSunday}</Text>
      </>
    )
  }
}
