#!/usr/bin/env node
import meow from 'meow'

const cli = meow(
	`
	Usage
	  $ sut <input> 

	Options
	  --rainbow, -r  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈 
`,
	{
		importMeta: import.meta,
	}
)

// NEED TO THINK ON HOW TO MAKE IT WORK FOR MULTIPLE FILES
console.log(cli.input[0], cli.flags)
