import axios, { AxiosInstance, AxiosResponse } from 'axios';
import 'dotenv/config';

const wordnikApiKey = process.env["wordnikApiKey"];
const wordsApiHeaderKey = process.env["wordsApiHeaderKey"];
const wordsApiHeaderHost = process.env["wordsApiHeaderHost"];
const wordsApiHeaders = { "X-RapidAPI-Key": wordsApiHeaderKey, "X-RapidAPI-Host": wordsApiHeaderHost };

export const wordsApiBaseUrl = "https://wordsapiv1.p.rapidapi.com/words/"
export const wordnikApiBaseUrl = "https://api.wordnik.com/v4/word.json/"
export const wordnikParams = { 'api_key': wordnikApiKey, 'limit': '3' }

export function buildAxiosInstances(word: string) {

  let instances = [];
  const wordsDefUrl = wordsApiBaseUrl + `${word}/definitions`;
  const wordnikExampleUrl = wordnikApiBaseUrl + `${word}/examples`;

  const wordsInstance: AxiosInstance = axios.create({
    baseURL: wordsDefUrl,
    headers: wordsApiHeaders
  });

  const wordnikInstance: AxiosInstance = axios.create({
    baseURL: wordnikExampleUrl,
    headers: wordnikParams
  });

  instances.push(wordsInstance);
  instances.push(wordnikInstance);

  return instances;
}

export type WordResult = {
  definition: string,
  example: string
}

export async function parseDefinitionAndExample(data: AxiosResponse[]): Promise<WordResult> {
  return new Promise((resolve, reject) => {
    let wordResult: WordResult = {
      definition: '',
      example: ''
    }
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
    return resolve(wordResult);
  })
}

export async function fetchDefinitionAndExample(instances: AxiosInstance[]) {
  let keeptrying = 0;
  let errorResponses: AxiosResponse[] = [];
  do {
    try {
      return await Promise.all(instances.map((instance: AxiosInstance) => instance.get(instance.defaults.baseURL!)))
    }
    catch (error: any) {
      if (keeptrying == 2) {
        errorResponses.push(error.response)
      }
      keeptrying++;
    }
  } while (keeptrying < 3)
  return await Promise.all(errorResponses);
}

export async function buildFetchParseWordResults(word: string) {
  const wordInstances: AxiosInstance[] = buildAxiosInstances(word);
  const rawWordResults = await fetchDefinitionAndExample(wordInstances);
  const wordResults = await parseDefinitionAndExample(rawWordResults);
  return wordResults;
}