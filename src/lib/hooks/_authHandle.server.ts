import { auth } from '$lib/utils'
import { dev } from '$app/environment'
import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'

import type { Handle } from '@sveltejs/kit'

/**
 * Check if the route is private and the user is logged in.
 * If not, redirect to the login page with the current URL as the referrer.
 */
const handle: Handle = async ({ event, resolve }) => {
	if (!event.route.id || !event.route.id.startsWith('/(authenticated)')) {
		return resolve(event)
	}

	const TVUPWEB_AUTH_SESSION_ID = event.cookies.get('TVUPWEB_AUTH_SESSION_ID')
	const referrer = encodeURIComponent(event.url.href)

	if (!TVUPWEB_AUTH_SESSION_ID) {
		redirect(307, `/login?referrer=${referrer}`)
	}

	event.locals.session = {
		...(await auth.getUserSession(TVUPWEB_AUTH_SESSION_ID).catch((error: Error) => {
			console.error(error)
			Sentry.captureEvent({
				event_id: crypto.randomUUID(),
				message: error.message,
				level: 'error'
			})
			event.cookies.set('TVUPWEB_AUTH_SESSION_ID', '', {
				expires: new Date(0),
				path: '/',
				secure: !dev
			})
			redirect(307, `/login?referrer=${referrer}&error=${error.message}`)
		}))
	}

	return resolve(event)
}

export default handle
