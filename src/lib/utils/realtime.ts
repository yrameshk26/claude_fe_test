// eslint-disable-next-line
// @ts-nocheck

import { createClient } from 'redis'

import { env } from '$env/dynamic/private'
import { building } from '$app/environment'

let publisher = {
	publish: (channel, callback) => {
		console.info(channel, 'Redis publisher not connected')
		if (callback) {
			callback()
		}
	}
}
let subscriber = {
	subscribe: (channel, callback: (data: string) => void) => {
		console.info(channel, 'Redis subscriber not connected')
		if (callback) {
			callback()
		}
	},
	unsubscribe: (channel) => {
		console.info(channel, 'Redis subscriber not connected')
	}
}

try {
	if (!building) {
		publisher = createClient({ url: env.REDIS_URL, pingInterval: 1000 })
		subscriber = publisher.duplicate({})

		publisher.on('connect', () => {
			console.info('Redis publisher connected')
		})
		publisher.on('error', (error) => {
			console.error('Redis publisher error:', error.message)
		})
		publisher.on('reconnecting', () => {
			console.info('Redis publisher reconnecting')
		})
		subscriber.on('connect', () => {
			console.info('Redis subscriber connected')
		})
		subscriber.on('error', (error) => {
			console.error('Redis subscriber error:', error.message)
		})
		subscriber.on('reconnecting', () => {
			console.info('Redis subscriber reconnecting')
		})

		await publisher.connect()
		await subscriber.connect()
	}
} catch (error) {
	if (error instanceof Error) {
		console.error('Redis connection error:', error.message)
	} else {
		console.error('Redis connection error')
	}
}

export default {
	publisher,
	subscriber
}
