import { graphqlFetchAction } from '$lib/utils'
import { redirect } from '@sveltejs/kit'

export async function load({ locals, fetch }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ app }) => app === 'CALLTRACK')
	) {
		redirect(307, '/unauthorized')
	}

	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_CALLTRACK_COUNTS($app: App!) {
				getSideBarCounts(app: $app)
			}
		`,
		variables: {
			app: 'CALLTRACK'
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
