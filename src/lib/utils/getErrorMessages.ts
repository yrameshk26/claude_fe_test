/**
 * Handles any error and returns an array of messages.
 * Errors can be of any type. Objects, strings, arrays, etc.
 */
export default function getErrorMessages(error: unknown): string[] {
	if (error instanceof Error) {
		return [error.message]
	} else if (error !== null && typeof error === 'object' && 'message' in error) {
		return getErrorMessages(error.message)
	} else if (typeof error === 'string') {
		return [error]
	} else if (Array.isArray(error)) {
		return error.map(getErrorMessages).flat()
	} else {
		return [JSON.stringify(error)]
	}
}
