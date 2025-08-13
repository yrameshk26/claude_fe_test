import loadTickets from '$lib/server/loadTickets'

export async function load({ fetch, locals, url, params }) {
	return loadTickets({
		fetch,
		url,
		defaultWhereFilter: {
			customer: { id: { equals: params.id } }
		},
		appName: 'BILLING',
		locals
	})
}
