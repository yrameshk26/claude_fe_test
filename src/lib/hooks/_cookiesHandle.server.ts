import type { Handle } from '@sveltejs/kit'

/**
 * Convert cookies from an array of objects to an object of key-value pairs
 * From [{ name: "cookie1", value: "value1" }, { name: "cookie2", value: "value2" }, ...]
 * To		{ cookie1: "value1", cookie2: "value2", ... }
 */
const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = {
		...event.locals.session,
		cookies: {}
	}

	const allCookies = event.cookies.getAll()

	// Convert cookies from an array of objects to an object of key-value pairs
	event.locals.session.cookies = allCookies.reduce(
		(
			acc: { [key: (typeof allCookies)[number]['name']]: (typeof allCookies)[number]['value'] },
			obj
		) => {
			// only add cookies starting with TVUPWEB_
			if (obj.name.startsWith('TVUPWEB_')) {
				acc[obj.name] = obj.value
			}
			return acc
		},
		{}
	)

	return resolve(event)
}

export default handle
