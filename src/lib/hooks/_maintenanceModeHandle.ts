import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'

import type { Handle } from '@sveltejs/kit'

/**
 * Redirect to the maintenance page if the app is in maintenance mode.
 */
const handle: Handle = async ({ event, resolve }) => {
	if (!event.route.id || event.route.id.startsWith('/(public)/maintenance')) {
		return resolve(event)
	}
	if (env.MAINTENANCE_MODE === 'true') {
		redirect(307, '/maintenance')
	} else {
		return resolve(event)
	}
}

export default handle
