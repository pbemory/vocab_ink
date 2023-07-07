import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  if (add && add.length > 0) {
    {
      add?.map((word) => {
        const row = `${word},0\n`
        try {
          //fs is considering pwd as vocab_ink/
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
          />
        ))}
      </>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
}
