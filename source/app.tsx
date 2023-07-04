import React from 'react';
import { Text } from 'ink';

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  return (
    <>
    {add?.map((word) => (
      <Text>
        Hello, <Text color="green">{word}</Text>
      </Text>
    ))}
    </>
  )
}
