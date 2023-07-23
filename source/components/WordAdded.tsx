import React from 'react';
import { Newline, Text } from 'ink';

type Props = {
  word: string;
}

export default function WordAdded({ word }: Props) {
  return (
    <Text>
      <Text
        bold
        color="greenBright"
      >
        ✔ {''}
      </Text>
      <Text
        color="whiteBright"
      >
        {word}
      </Text>
      <Newline/>
    </Text>
  )
}