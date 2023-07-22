import React from "react";
import { ReadHistoryData } from "../helpers.js";
import { Text, Box } from 'ink';

export default function HistoryDataDisplay({ wordsLearnedThisWeek, wordsRemaining }: ReadHistoryData) {
  return (
    <>
    <Box borderStyle="classic" width="50%" justifyContent="center">
    <Text bold color="green">YOUR PROGRESS:</Text>
    </Box>
      <Box borderStyle="classic" width="50%" justifyContent="center">
        <Text>{wordsLearnedThisWeek} words learned this week of {wordsRemaining} words remaining...</Text>
      </Box>
    </>
  )
}