import React, { useEffect, useRef, useState } from 'react';
import { Text, Box, useApp } from 'ink';
import { shuffleArray, readRows, ReadHistoryData, save, updateWordBankFromScore, findNewWord } from '../helpers.js';
import { buildFetchParseWordResults } from '../wordClient.js';
import Question from './Question.js';
import Example from './Example.js';


export default function Exercise({ wordsLearnedThisWeek }: ReadHistoryData) {

  const oldWordBankRef = useRef<any[]>([]);
  const newWordBankRef = useRef<any[]>([]);
  const [showQuestion, setShowQuestion] = useState(true);
  const [rowCursor, setRowCursor] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordDef, setCurrentWordDef] = useState('loading...');
  const [currentWordEx, setCurrentWordEx] = useState('');
  const [score, setScore] = useState<number[]>([]);
  const [calledFromExample, setCalledFromExample] = useState(false);
  const [userSaved, setUserSaved] = useState(false);
  const { exit } = useApp();

  useEffect(() => {

    const getWordBank = async () => {
      
      let wordBankRows: any[] = await readRows('../utils/word_bank.csv');
      //shuffle it
      oldWordBankRef.current = shuffleArray(wordBankRows);
      const newWordData = findNewWord(oldWordBankRef,newWordBankRef);
      const {newWord, currentIndex} = newWordData;
      setCurrentWord(newWord);
      setRowCursor(currentIndex);
      const wordResults = await buildFetchParseWordResults(newWord!);
      setCurrentWordDef(`'` + wordResults.definition.substring(0, 250) + `'`);
      setCurrentWordEx(`'` + wordResults.example.substring(0, 250) + `'`);
    }
    getWordBank();

  }, [])

  useEffect(() => {
    if (calledFromExample) {
      setCalledFromExample(false);
      updateWordBankFromScore(score,oldWordBankRef,newWordBankRef,rowCursor);
      const updateQuestion = async () => {
        const newWordData = findNewWord(oldWordBankRef,newWordBankRef, rowCursor);
        const {newWord, currentIndex} = newWordData;
        setCurrentWord(newWord);
        setRowCursor(currentIndex);
        const wordResults = await buildFetchParseWordResults(newWord);
        setCurrentWordDef(`'` + wordResults.definition.substring(0, 250) + `'`);
        setCurrentWordEx(`'` + wordResults.example.substring(0, 250) + `'`);
      }
      updateQuestion();
    }
  }, [rowCursor])

  useEffect(() => {
    if (userSaved) {
      save(oldWordBankRef,newWordBankRef,wordsLearnedThisWeek,rowCursor,score)
        .then(() => {
          exit();
        })
    }
  }, [userSaved])

  return (
    <>
      <Box
        borderStyle="round"
        borderColor="green"
        width="100%"
        justifyContent="center"
      >
        <Text
          bold
          color="greenBright"
        >
          EXERCISE:
        </Text>
      </Box>
      {showQuestion ? (
        <Question
          currentWordDef={currentWordDef}
          setCurrentWordDef={setCurrentWordDef}
          setShowQuestion={setShowQuestion}
          currentWord={currentWord}
          score={score}
          setScore={setScore}
          setUserSaved={setUserSaved}
        />
      ) : (
        <Example
          rowCursor={rowCursor}
          setRowCursor={setRowCursor}
          currentWordEx={currentWordEx}
          setShowQuestion={setShowQuestion}
          currentWord={currentWord}
          setCalledFromExample={setCalledFromExample}
          score={score}
          setUserSaved={setUserSaved}
        />
      )}
    </>
  );
}