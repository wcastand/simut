import { array } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import chalk from 'chalk'

type TestType = 'test' | 'group'

let total = 0
let success = 0
const hash: TE.TaskEither<[string, Error], [TestType, string]>[] = []

export function test(title: string, fn: () => Promise<void>): void {
	const task = TE.tryCatch<[string, Error], [TestType, string]>(
		async () => {
			await fn()
			return ['test', title]
		},
		(reason) => [title, new Error(String(reason))]
	)
	hash.push(task)
}

export function group(title: string) {
	hash.push(TE.right(['group', title]))
}

export function run() {
	pipe(
		array.sequence(T.task)(hash),
		T.map((x) =>
			x.map(
				E.fold(
					([title, err]) => {
						total++
						console.log('-', chalk.red('Error'), ':', chalk.blue(title))
						console.log('  ', chalk.red(err.message))
					},
					([type, v]) => {
						if (type !== 'group') {
							total++
							success++
							console.log('-', chalk.green('OK'), '   :', chalk.blue(v))
						} else console.log(chalk.bold.yellow(v))
					}
				)
			)
		)
	)().then(() => {
		console.log()
		console.log(chalk.bold.white(`Result: `))
		console.log(chalk.blue(`- ${total} tests executed`))
		console.log(chalk.green(`- ${success} tests successful`))
		console.log(chalk.red(`- ${total - success} tests failed`))
		console.log()
	})
}
