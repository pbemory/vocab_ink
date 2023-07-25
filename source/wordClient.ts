import axios from 'axios';
import 'dotenv/config';

const wordnikApiKey = process.env["wordnikApiKey"];
const wordsApiHeaderKey = process.env["wordsApiHeaderKey"];
const wordsApiHeaderHost = process.env["wordsApiHeaderHost"];
const wordsApiHeaders = { "X-RapidAPI-Key": wordsApiHeaderKey, "X-RapidAPI-Host": wordsApiHeaderHost };

const wordsApiBaseUrl = "https://wordsapiv1.p.rapidapi.com/words/"
const wordnikApiBaseUrl = "https://api.wordnik.com/v4/word.json/"
const wordnikParams = { 'api_key': wordnikApiKey, 'limit': '3' }

export type WordResult = {
  definition: string,
  example: string
}

async function getWordsApiDefinition(word: string) {
  const url = wordsApiBaseUrl + `${word}/definitions`;
  let wordDef = "No definition found."
  try {
    const instance = axios.create({
      baseURL: url,
      headers: wordsApiHeaders
    });
    instance.get(url)
      .then(response => {
        const errorKey = 'message';
        if (errorKey in response.data) {
          wordDef = "Error: " + response.data[errorKey]
        }
        else {
          const definitions = response.data.definitions;
          if (definitions.length > 0) {
            wordDef = definitions[0]['definition']
          }
        }
        return wordDef;
      })
      .catch(error => wordDef = "Exception: " + String(error))
  } catch (err) {
    console.log(err);
  }
}

async function getWordnikApiExample(word: string) {
  const url = wordnikApiBaseUrl + `${word}/examples`;
  let wordExample = "No example found.";
  try {
    const instance = axios.create({
      baseURL: url,
      headers: wordnikParams
    });
    instance.get(url)
      .then(response => {
        const exampleKey = 'text'
        const errorKey = 'message'
        if (errorKey in response.data) {
          wordExample = "Error: " + response.data[errorKey];
        }
        else {
          response.data['examples'].every(
            (element:any) => {
              if (exampleKey in element) {
                wordExample = element[exampleKey];
                return false;
              }
              return true;
            }
          )
        }
        return wordExample;
      })
      .catch(error => { 
        wordExample = "Exception: " + String(error) })
  }
  catch (err) {
    console.log(err);
  }
}