import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useApp, Newline, render } from 'ink';

type QuestionProps = {
  rowCursor: number,
  setRowCursor: (rowCursor: number) => void,
}

export default function Question({ rowCursor }: QuestionProps) {
  return (
    <Box
      borderStyle="round"
      borderColor="green"
      width="100%"
    >
      <Box
        marginLeft={1}
      >
        <Text>
          <Text
            color="greenBright"
          >
            Question {rowCursor + 1}:
          </Text>
          <Newline />
          <Text
          >
            {promptPreText}{' '}
          </Text>
          <Text
            bold
            color="whiteBright"
          >
            {currentWordDef}
          </Text>
          <Text>
            ?{' '}
          </Text>
          <TextInput
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
          />
        </Text>
      </Box>
    </Box>
  );
}