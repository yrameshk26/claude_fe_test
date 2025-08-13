import loadDailyReportLogSummary from '$lib/server/loadDailyReportLogSummary.js'

export async function load({ fetch, url }) {
	return loadDailyReportLogSummary({
		fetch,
		queryName: 'GET_SALES_REPORT_LOG_SUMMARY',
		query: 'getSalesReportLogSummary',
		url
	})
}
