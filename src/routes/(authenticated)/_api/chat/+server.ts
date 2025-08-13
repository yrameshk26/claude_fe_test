import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch }) => {
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
				query GET_MY_CONVERSATIONS {
					getMyConversations
				}
			`
	})

	if (errors) {
		return json({ errors })
	}

	return json(data.getMyConversations)
}
