import loadTickets from '$lib/server/loadTickets'

export async function load({ fetch, locals, url }) {
	return loadTickets({
		fetch,
		url,
		defaultWhereFilter: {
			customerID: { not: null },
			dailyReportLogID: { equals: null }
		},
		appName: 'BILLING',
		locals
	})
}
