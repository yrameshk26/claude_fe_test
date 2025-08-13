import loadTickets from '$lib/server/loadTickets'

export async function load({ fetch, locals, url }) {
	return loadTickets({
		fetch,
		url,
		defaultWhereFilter: {
			dailyReportLogID: { not: null },
			customerID: { equals: null }
		},
		appName: 'ACCOUNTING',
		locals
	})
}
