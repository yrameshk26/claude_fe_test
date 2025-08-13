import { WebSocketServer } from 'ws'
import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL
const PORT = process.env.WS_PORT || 4000

const pub = createClient({ url: REDIS_URL })
const sub = pub.duplicate()

const CHANNELS = ['APP_UPDATED_BY', 'CHAT', 'MARK_CHAT_AS_READ']

async function connectRedis(client, label) {
	client.on('error', (err) => {
		console.error(`❌ Redis ${label} error:`, err.message)
	})
	client.on('reconnecting', () => {
		console.warn(`↩️ Redis ${label} reconnecting...`)
	})
	client.on('connect', () => {
		console.log(`✅ Redis ${label} connected`)
	})
	client.on('end', () => {
		console.warn(`🔌 Redis ${label} connection closed`)
	})

	try {
		await client.connect()
	} catch (err) {
		console.error(`🚫 Failed to connect Redis ${label}:`, err.message)
		process.exit(1)
	}
}

async function start() {
	await connectRedis(pub, 'publisher')
	await connectRedis(sub, 'subscriber')

	const wss = new WebSocketServer({ port: PORT })

	for (const ch of CHANNELS) {
		await sub.subscribe(ch, (msg) => {
			console.log(`📥 Received Redis message on "${ch}":`, msg)
			const parsed = JSON.parse(msg)
			wss.clients.forEach((ws) => {
				if (ws.readyState === ws.OPEN) {
					ws.send(JSON.stringify({ type: ch, data: parsed }))
					console.log(`📤 Broadcasted to client on channel "${ch}"`)
				}
			})
		})
	}

	wss.on('connection', (ws) => {
		const clientId = Math.random().toString(36).substring(2, 10)
		console.log(`🔌 WebSocket connected [${clientId}]`)

		ws.on('message', async (msg) => {
			try {
				const { type, data } = JSON.parse(msg.toString())
				console.log(`💬 [${clientId}] -> ${type}`, data)
				if (CHANNELS.includes(type)) {
					await pub.publish(type, JSON.stringify(data))
					console.log(`📡 Redis publish on "${type}"`)
				}
			} catch (err) {
				console.error(`⚠️ Invalid WS message from [${clientId}]:`, err.message)
			}
		})

		ws.on('close', () => {
			console.log(`❎ WebSocket disconnected [${clientId}]`)
		})

		ws.on('error', (err) => {
			console.error(`🔥 WebSocket error [${clientId}]:`, err.message)
		})
	})

	console.log(`📡 WebSocket server ready on ws://localhost:${PORT}`)
}

start().catch((err) => {
	console.error('❌ Failed to start server:', err)
	process.exit(1)
})
