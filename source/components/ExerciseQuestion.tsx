import React, {useEffect, useState} from 'react';
import { useInput, useApp, Box, Text, useStdin, } from 'ink';

export type Props = {
  word: string,
}

export default function ExerciseQuestion({ word }: Props) {
  const { exit } = useApp();
  const {stdin, setRawMode} = useStdin();
  const [typedData,setTypedData] = useState('');

  const stdinInputHandler = (data: unknown) => {
    const rawData = String(data);
    setTypedData(rawData);
  }

  useEffect(() => {
    setRawMode(true);
    stdin?.on('data', stdinInputHandler); 
  },[])

  // const [x, setX] = React.useState(1);
  // const [y, setY] = React.useState(1);

  // useInput((input, key) => {
    // if (input === 'q') {
    //   exit();
    // }

    // if (key.leftArrow) {
    //   setX(Math.max(1, x - 1));
    // }

    // if (key.rightArrow) {
    //   setX(Math.min(20, x + 1));
    // }

    // if (key.upArrow) {
    //   setY(Math.max(1, y - 1));
    // }

    // if (key.downArrow) {
    //   setY(Math.min(10, y + 1));
    // }
  // });

  return (
    <>
      <Text>What word means {word}? {typedData}</Text>
    </>
  );
}