import loadActivities from '$lib/server/loadActivities'

export async function load({ fetch, locals, url }) {
	return loadActivities({
		fetch,
		url,
		defaultWhereFilter: {
			app: { equals: 'BILLING' }
		},
		locals
	})
}
