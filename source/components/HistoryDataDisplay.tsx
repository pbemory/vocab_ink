import React from "react";
import { ReadHistoryData } from "../helpers.js";
import { Text, Box, Newline } from 'ink';

export default function HistoryDataDisplay({ wordsLearnedThisWeek, wordsRemaining }: ReadHistoryData) {
  return (
    <>
      <Box borderStyle="round" borderColor="green" width="50%" justifyContent="center">
        <Text bold color="greenBright">PROGRESS REPORT:</Text>
      </Box>
      <Box borderStyle="round" borderColor="green" width="50%" justifyContent="center">
        <Text bold color="green">{wordsLearnedThisWeek}</Text>
        <Text> words learned this week of </Text><Text color="whiteBright" bold>{wordsRemaining}</Text><Text> words remaining...</Text>
      </Box>

    </>
  )
}