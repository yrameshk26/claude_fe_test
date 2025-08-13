import { dev } from '$app/environment'

import type { Handle } from '@sveltejs/kit'

/**
 * Set a unique fingerprint for this device using the IP address.
 */
const handle: Handle = async ({ event, resolve }) => {
	let ipAddress
	try {
		ipAddress = event.getClientAddress()
	} catch (error) {
		console.error(error)
		ipAddress = event.request.headers.get('x-forwarded-for') || '0.0.0.0'
	}
	event.cookies.set('TVUPWEB_FINGERPRINT', ipAddress, {
		path: '/',
		secure: !dev
	})

	return resolve(event)
}

export default handle
