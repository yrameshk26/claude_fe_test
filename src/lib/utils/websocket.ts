type MessageHandler = (data: any) => void

import { env } from '$env/dynamic/public'
import { invalidateAll } from '$app/navigation'

export function connectWebSocket(type: string, onMessage: MessageHandler) {
	let socket: WebSocket
	let reconnectTimeout: NodeJS.Timeout | null = null
	let manuallyClosed = false
	const reconnectDelay = 3000

	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			console.log('👁️ Tab hidden. Closing socket.')
			manuallyClosed = true
			socket.close()
		} else {
			console.log('👁️ Tab visible. Reconnecting socket.')
			if (socket.readyState === WebSocket.CLOSED) {
				connect()
				if (type === 'APP_UPDATED_BY') invalidateAll()
			}
		}
	})

	const connect = () => {
		manuallyClosed = false
		socket = new WebSocket(env.PUBLIC_WEB_SOCKET_URL)

		socket.onopen = () => {
			console.log('✅ WebSocket connected')
		}

		socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data)
				if (message.type === type) onMessage(message)
			} catch (e) {
				console.warn('⚠️ Failed to parse WS message:', e)
			}
		}

		socket.onerror = (event) => {
			console.error('❌ WebSocket error:', event)
		}

		socket.onclose = (event) => {
			console.warn(`🔌 WebSocket closed: ${event.reason || 'no reason'} (will retry)`)
			if (!manuallyClosed && !reconnectTimeout) {
				reconnectTimeout = setTimeout(() => {
					reconnectTimeout = null
					connect()
				}, reconnectDelay)
			}
		}
	}

	connect()

	return {
		send(data: any) {
			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(data))
			} else {
				console.warn('⚠️ Tried to send over closed WebSocket')
			}
		},
		disconnect() {
			if (reconnectTimeout) clearTimeout(reconnectTimeout)
			socket?.close()
		}
	}
}
