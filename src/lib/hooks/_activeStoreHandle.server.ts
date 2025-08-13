import { dev } from '$app/environment'
import { redirect } from '@sveltejs/kit'

import type { Handle } from '@sveltejs/kit'

const handle: Handle = async ({ event, resolve }) => {
	if (!event.route.id?.startsWith('/(authenticated)')) {
		return resolve(event)
	}

	const activeStoreId =
		event.cookies.get('TVUPWEB_ACTIVE_STORE') || '52033280-626a-4b42-9bb0-03908f585299'

	let cookie = '' // cookie to set in the response

	if (activeStoreId) {
		// TODO: make sure active store is valid by calling API
		const isValid = true
		if (!isValid) {
			event.locals.session.activeStoreId = null
			// active store is invalid, remove it from cookies
			cookie = event.cookies.serialize('TVUPWEB_ACTIVE_STORE', '', {
				expires: new Date(0),
				path: '/',
				secure: !dev
			})
		} else {
			cookie = event.cookies.serialize('TVUPWEB_ACTIVE_STORE', activeStoreId, {
				path: '/',
				secure: !dev
			})
			event.locals.session.activeStoreId = activeStoreId
		}
	}

	if (!event.locals.session.activeStoreId) {
		// no store matches the IP address, redirect to store selection
		const referrer = encodeURIComponent(event.url.href)
		redirect(307, `/activeStore?referrer=${referrer}`)
	}

	if (cookie) {
		event.cookies.set('TVUPWEB_ACTIVE_STORE', activeStoreId, {
			path: '/',
			secure: !dev
		})
	}

	const response = await resolve(event)

	return response
}

export default handle
