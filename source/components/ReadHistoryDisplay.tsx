import React from "react";
import { ReadHistoryData } from "../helpers.js";
import { Text, Box, Newline } from 'ink';

export default function ReadHistoryDisplay({ wordsLearnedThisWeek, wordsRemaining }: ReadHistoryData) {
  return (
    <>
      <Box
        borderStyle="round"
        borderColor="green"
        width="75%"
        justifyContent="center"
      >
        <Text
          bold
          color="greenBright"
        >
          PROGRESS REPORT:
        </Text>
      </Box>
      <Box
        borderStyle="round"
        borderColor="green"
        width="75%"
        justifyContent="center"
      >
        <Text
          bold
          color="whiteBright"
        >
          {wordsLearnedThisWeek} {''}
        </Text>
        <Text>
          words learned this week of
        </Text>
        <Text
          bold
          color="whiteBright"
        >
          {''} {wordsRemaining} {''}
        </Text>
        <Text>
          remaining...
        </Text>
      </Box>
    </>
  )
}