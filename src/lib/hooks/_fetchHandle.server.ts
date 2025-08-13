import type { HandleFetch } from '@sveltejs/kit'
import { realtime } from '$lib/utils'

const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	// add cookies to request headers
	const AUTH_SESSION_ID = event.locals.session.cookies['TVUPWEB_AUTH_SESSION_ID']
	const FINGERPRINT = event.locals.session.cookies['TVUPWEB_FINGERPRINT']
	const TVUPWEB_ACTIVE_STORE = event.locals.session.cookies['TVUPWEB_ACTIVE_STORE']

	request.headers.set(
		'cookie',
		`AUTH_SESSION_ID=${AUTH_SESSION_ID}; TVUPWEB_FINGERPRINT=${FINGERPRINT}; TVUPWEB_ACTIVE_STORE=${TVUPWEB_ACTIVE_STORE}`
	)

	// used to determine if request was a mutation
	const clonedRequest = request.clone()

	const requestBody = await clonedRequest.text()
	const operationName =
		requestBody.match(/(?:query|mutation)\s+([A-Z_]+)/)?.[1] || 'UNKNOWN_OPERATION'
	const timeLog = new Date().getTime() + ': ' + operationName.padEnd(35, ' ') + AUTH_SESSION_ID
	console.time(timeLog)

	const response = await fetch(request)
	console.timeEnd(timeLog)

	// try sending realtime event if request was a mutation
	try {
		// const requestBody = await clonedRequest.text()
		const isMutation = requestBody.includes('mutation')
		if (isMutation && event.locals.session && AUTH_SESSION_ID && FINGERPRINT) {
			// send realtime event if response is ok
			const responseClone = response.clone()
			if (responseClone.ok) {
				const hasErrors = (await responseClone.text()).includes('errors')
				if (!hasErrors) {
					const mutationName = requestBody.match(/mutation (\w+)/)?.[1]
					realtime.publisher.publish(
						'APP_UPDATED_BY',
						JSON.stringify({
							FINGERPRINT,
							authUserID: event.locals.session.id,
							mutationName,
							AUTH_SESSION_ID
						})
					)
				}
			}
		}
	} catch (error) {
		if (error instanceof TypeError) {
			console.error('Error sending realtime event', error.message)
		} else {
			console.error('Error sending realtime event', error)
		}
	}

	return response
}

export default handleFetch
