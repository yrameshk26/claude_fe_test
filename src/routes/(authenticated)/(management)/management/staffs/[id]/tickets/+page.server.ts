import loadTickets from '$lib/server/loadTickets'

export async function load({ fetch, locals, url, params }) {
	return loadTickets({
		fetch,
		url,
		defaultWhereFilter: {
			assignedTo: { equals: params.id }
		},
		locals
	})
}
