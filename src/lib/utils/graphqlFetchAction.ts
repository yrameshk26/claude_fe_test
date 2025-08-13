import { env } from '$env/dynamic/private'

import getErrorMessages from './getErrorMessages'

export default async function graphqlFetchAction({
	fetch: fetchFunction,
	query,
	variables
}: {
	fetch?: typeof fetch
	query: string
	variables?: { [key: string]: FormDataEntryValue | null | string | object | number | boolean }
}) {
	const body = JSON.stringify({
		query,
		variables
	})

	const fetchFn = fetchFunction || fetch

	// const operationName =
	// 	new Date().getTime() + ': ' + query.match(/(?:query|mutation)\s+([A-Z_]+)/)?.[1].padEnd(40, ' ')
	// console.time(operationName)
	const res = await fetchFn(env.GRAPHQL_ENDPOINT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body,
		signal: AbortSignal.timeout(5000)
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err)
			return getErrorMessages(err)
		})

	// log the response header AUTH_SESSION_ID

	// console.timeEnd(operationName)

	if (res.errors) {
		return [null, getErrorMessages(res.errors), res.errors]
	} else if (!res.success && res.message) {
		return [null, [res.message]]
	} else if (!res.data) {
		return [null, ['Invalid response from server.', JSON.stringify(res)]]
	} else {
		return [res.data, null]
	}
}
