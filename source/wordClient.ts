import axios, { AxiosInstance } from 'axios';
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

function buildAxiosInstances(word: string) {

  let instances = [];
  const wordsDefUrl = wordsApiBaseUrl + `${word}/definitions`;
  const wordnikExampleUrl = wordnikApiBaseUrl + `${word}/examples`;

  const wordsInstance = axios.create({
    baseURL: wordsDefUrl,
    headers: wordsApiHeaders
  });

  const wordnikInstance = axios.create({
    baseURL: wordnikExampleUrl,
    headers: wordnikParams
  });

  instances.push(wordsInstance);
  instances.push(wordnikInstance);

  return instances;
}

async function fetchDefinitionAndExample(instances: any[]) {

  let wordResult: WordResult = {
    definition: '',
    example: ''
  }

  axios.all(instances.map((instance: AxiosInstance) => instance.get(instance.defaults.baseURL!)))
    .then((data) => {
      data.forEach(response => {
        const host = response.request.host;
        if (String(host).includes('wordnik')) {
          let wordExample = "No example found.";
          const exampleKey = 'text'
          const errorKey = 'message'
          if (errorKey in response.data) {
            wordExample = "Error: " + response.data[errorKey];
          }
          else {
            response.data['examples'].every(
              (element: any) => {
                if (exampleKey in element) {
                  wordExample = element[exampleKey];
                  return false;
                }
                return true;
              }
            )
          }
          wordResult.example = wordExample;
        } else {
          let wordDef = "No definition found."
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
          wordResult.definition = wordDef;
        }
      })
      return wordResult;
    })
    .catch(error => console.log(error))
}

async function testResults() {
  const testInstances = buildAxiosInstances('lovely');
  const testResults = await fetchDefinitionAndExample(testInstances);
  console.log(testResults);
}

testResults();