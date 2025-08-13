import loadTickets from '$lib/server/loadTickets'

export async function load({ fetch, locals, url, params }) {
	return loadTickets({
		fetch,
		url,
		defaultWhereFilter: {
			dailyReportLog: { id: { equals: params.id } }
		},
		appName: 'ACCOUNTING',
		locals
	})
}
