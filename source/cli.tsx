#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
  `
	Usage
	  $ vocab_ink

	Options
		--add, -a new words to add to the word bank.

	Examples
	  $ vocab_ink --add objurgate, mollify, globose
`,
  {
    importMeta: import.meta,
    flags: {
      add: {
        type: 'string',
        alias: 'a',
        isMultiple: true,
      },
    },
  },
);

render(<App add={cli.flags.add} />);
