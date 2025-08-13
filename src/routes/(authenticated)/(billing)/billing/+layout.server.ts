import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch }) {
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_BILLING_COUNTS($app: App!) {
				getSideBarCounts(app: $app)
			}
		`,
		variables: {
			app: 'BILLING'
		}
	})

	if (errors) {
		return {
			errors
		}
	}

	return {
		counts: data.getSideBarCounts
	}
}
