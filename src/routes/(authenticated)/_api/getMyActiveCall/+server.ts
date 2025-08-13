import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch }) => {
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_MANAGEMENT_COUNTS($app: App!) {
				getSideBarCounts(app: $app)
			}
		`,
		variables: {
			app: 'MANAGEMENT'
		}
	})

	if (errors) {
		return json({ errors })
	}

	return json({
		activeCall: data.getSideBarCounts.activeCall[0]
	})
}
