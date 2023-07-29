import React, { useEffect, useState } from 'react';
import { Text, Box, useApp } from 'ink';
import TextInput from 'ink-text-input';

export default function Exercise() {
  const { exit } = useApp();
  const [query, setQuery] = useState('');
  const [promptText, setPromptText] = useState('What words means');
  const [rowCursor, setRowCursor] = useState(0);

  let testArray = ['mollify', 'blandishment', 'objurgate'];

  const handleSubmit = () => {
    if (query === 'q') {
      exit();
    }
    //need some notion of a cursor in the csv
    setQuery('');
    setRowCursor(rowCursor + 1);

  }

  return (
    <Box
      borderStyle="round"
      borderColor="green"
      width="75%"
    >
      <Box
        marginRight={1}
        marginLeft={1}
      >
        <Text
        >
          {promptText}{' '}
        </Text>
        <Text
          bold
          color="whiteBright"
        >
        '{testArray[rowCursor]}'
        </Text>
        <Text>
          ?
        </Text>
      </Box>
      <TextInput
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}