import fetch from 'node-fetch'
import { strict as assert } from 'assert'

import { test, run, group } from '../src/'
import { lonelyNumber } from './example'

group('Simple')

test('should return product', async () => assert.equal(lonelyNumber(1, 2, 3), 6, 'should return the product'))
test('should return the lonely number', async () => assert.equal(lonelyNumber(1, 1, 3), 3, 'should return the lonely number'))

group('Async')

test('should return the lonely number', async () =>
	new Promise((r, re) => {
		setTimeout(() => {
			try {
				assert.equal(lonelyNumber(1, 1, 4), 4, 'should return the lonely number')
				r()
			} catch (e) {
				re(e)
			}
		}, 1000)
	}))
test('should return product', async () => assert.equal(lonelyNumber(1, 2, 3), 6, 'should return the product'))

group('After Async')

test('should return 1', async () => assert.equal(lonelyNumber(3, 3, 3), 1, 'should return 1'))
test('should return the lonely number', async () => assert.equal(lonelyNumber(3, 1, 3), 1, 'should return the lonely number'))
test('should return the lonely number', async () => assert.equal(lonelyNumber(3, 1, 3), 3, 'should return the lonely number'))

group('Fetch first')

test('should return 1', async () =>
	fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(() =>
		assert.equal(lonelyNumber(3, 3, 3), 1, 'should return 1')
	))

run()
