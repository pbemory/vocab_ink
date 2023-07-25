import React from 'react';
import { Newline, Text } from 'ink';

type Props = {
  word: string;
  lastWord?: string;
}

export default function WordAdded({ word, lastWord }: Props) {
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
        {word}{word != lastWord ? "\n" : ""}
      </Text>
    </Text>
  )
}