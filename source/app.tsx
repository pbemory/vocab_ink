import React from 'react';
import { Text } from 'ink';
import { appendFileSync } from 'fs';

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  {add?.map((word) => {
    const row = `${word},0\n`
    try {
      //fs is considering pwd as vocab_ink/
      appendFileSync('./word_bank.csv', row);
    } catch (err) {
      console.error(err);
    }
  })}
  return (
    <>
    {add?.map((word) => (
      <Text key={word}>
        Helloz, <Text color="green">{word}</Text>
      </Text>
    ))}
    </>
  )
}
