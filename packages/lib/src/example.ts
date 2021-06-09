export function lonelyNumber(a: number, b: number, c: number): number {
	const res = a * b * c
	if (res === Math.pow(a, 3)) return 1
	if (a === b || b === c || c === a) return a ^ b ^ c
	return res
}
