import loadDailyReportLogSummary from '$lib/server/loadDailyReportLogSummary.js'

export async function load({ fetch, url }) {
	return loadDailyReportLogSummary({
		fetch,
		queryName: 'GET_TOTAL_REPORT_LOG_SUMMARY',
		query: 'getTotalReportLogSummary',
		url
	})
}
