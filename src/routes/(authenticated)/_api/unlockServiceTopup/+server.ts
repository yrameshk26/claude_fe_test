import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { serviceID } = await request.json()
	const [response, errors] = await graphqlFetchAction({
		fetch,
		query: `
			mutation UNLOCK_SERVICE_TOPUP($id: String!) {
				unlockServiceTopup(id: $id)
			}
		`,
		variables: {
			id: serviceID
		}
	})

	if (errors) {
		return json({ errors })
	}

	return json({
		data: response
	})
}
