import React from 'react';
import { Text } from 'ink';

type Props = {
  word: string;
}

export default function WordAdded({ word }: Props) {
  return (
    <>
      <Text>
        <Text bold color="green">✔</Text> {word}
      </Text>
    </>
  )
}