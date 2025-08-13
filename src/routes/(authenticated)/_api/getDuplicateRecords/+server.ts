import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch, url }) => {
	const model = url.searchParams.get('model')
	const columns = JSON.parse(url.searchParams.get('columns') || '[]')

	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
		query GET_DUPLICATE_RECORDS_BY_MODEL($model: String!, $columns: [String!]!) {
			getAllDuplicateRecordsByModel(model: $model, columns: $columns)
		}
	`,
		variables: {
			model: model,
			columns: columns
		}
	})

	if (errors) {
		return json({ errors })
	}

	return json(data.getAllDuplicateRecordsByModel)
}
