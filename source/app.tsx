import React from 'react';
import { appendFileSync } from 'fs';
import WordAdded from './components/WordAdded.js';
import ExerciseQuestion from './components/ExerciseQuestion.js';
import { getReadHistory, addWordToWordBank, ReadHistoryData } from './helpers.js';
import { Text, Box, render } from 'ink';
import HistoryDataDisplay from './components/HistoryDataDisplay.js';

let readHistory: ReadHistoryData = await getReadHistory();

type Props = {
  add?: string[] | undefined;
};

export default function App({ add }: Props) {
  if (add && add.length > 0) {
    {
      add?.map((word) => {
        addWordToWordBank(word);
      })
    }
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
            WORDS ADDED:
          </Text>
        </Box>
        <Box
          borderStyle="round"
          borderColor="green"
          width="75%"
          justifyContent="center"
        >
          <Text>
            {add?.map((word) => (
              <WordAdded
                word={word}
                key={word}
                lastWord={add[add.length - 1]}
              />
            ))}
          </Text>
        </Box>
      </>
    )
  }
  else {
    let testArray = ['firstWord','secondWord'];
    return (
      <>
        <HistoryDataDisplay {...readHistory} />
        {/* {testArray.map((word)=>{
          <ExerciseQuestion word={word}/>
        })} */}
        <ExerciseQuestion word={'test'}/>
      </>
    )
  }
}
