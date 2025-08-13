import type { Handle } from '@sveltejs/kit'

/**
 * Set a cookie with last active time
 */
const handle: Handle = async ({ event, resolve }) => {
	// set a cookie with last active time
	event.cookies.set('TVUPWEB_LAST_ACTIVE', new Date().getTime() + '', {
		path: '/',
		secure: false,
		httpOnly: false
	})

	return resolve(event)
}

export default handle
