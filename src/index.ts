import { array } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import chalk from 'chalk'

type TestType = 'only' | 'test' | 'group'
type TestTask = TE.TaskEither<[string, Error], [TestType, string]>
let total = 0
let success = 0
const hash: [TestType, TestTask][] = []

export function test(title: string, fn: () => Promise<void>): void {
	const task = TE.tryCatch<[string, Error], [TestType, string]>(
		async () => {
			await fn()
			return ['test', title]
		},
		(reason) => [title, new Error(String(reason))]
	)
	hash.push(['test', task])
}

export function only(title: string, fn: () => Promise<void>): void {
	const task = TE.tryCatch<[string, Error], [TestType, string]>(
		async () => {
			await fn()
			return ['test', title]
		},
		(reason) => [title, new Error(String(reason))]
	)
	hash.push(['only', task])
}

export function group(title: string) {
	hash.push(['group', TE.right(['group', title])])
}

export function run() {
	const tasks = hash.some(([type]) => type === 'only') ? hash.filter(([type]) => type === 'only' || type === 'group') : hash
	pipe(
		array.sequence(T.task)(tasks.map(([, t]) => t)),
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
