import React, { useEffect, useState } from 'react';
import { Text, Box, useApp, render } from 'ink';
import Exercise from './Exercise.js';
import TextInput from 'ink-text-input';
import { getReadHistory,ReadHistoryData } from '../helpers.js';
import ReadHistoryDisplay from './ReadHistoryDisplay.js';

let readHistory: ReadHistoryData = await getReadHistory();

export default function ExerciseYN({ wordsLearnedThisWeek, wordsRemaining }: ReadHistoryData) {
  const { exit } = useApp();
  const [query, setQuery] = useState('');


  const handleSubmit = () => {
    if (query === 'n') {
      exit();
    }
    else if (query === 'y') {
      render(
        <>
          <ReadHistoryDisplay {...readHistory} />
          <Exercise {...readHistory}/>
        </>
      )
    }
  }
  return (
    <Box
      borderStyle="round"
      borderColor="green"
      width="100%"
    >
      <Box
        marginRight={1}
        marginLeft={1}
      >
        <Text
        >
          Start exercise (y) or quit (n)?
        </Text>
      </Box>
      <TextInput
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}