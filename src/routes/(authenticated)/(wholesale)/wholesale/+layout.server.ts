import { graphqlFetchAction } from '$lib/utils'
import { redirect } from '@sveltejs/kit'

export async function load({ fetch, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ app }) => app === 'WHOLESALE')
	) {
		redirect(307, '/unauthorized')
	}

	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_WHOLESALE_COUNTS($app: App!) {
				getSideBarCounts(app: $app)
			}
		`,
		variables: {
			app: 'WHOLESALE'
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
