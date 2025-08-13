import type { HandleServerError } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'

const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID()

	console.error((error as Error)?.message)
	Sentry.captureException(error, {
		extra: { event, errorId, status }
	})

	return {
		message,
		errorId
	}
}

export default handleError
