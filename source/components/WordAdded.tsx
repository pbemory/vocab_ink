import React from 'react';
import { Text } from 'ink';

type Props = {
  word: string;
}

export default function WordAdded({ word }: Props) {
  return (
    <>
      <Text>
        <Text bold color="greenBright">{word}</Text> added to word bank!
      </Text>
    </>
  )
}