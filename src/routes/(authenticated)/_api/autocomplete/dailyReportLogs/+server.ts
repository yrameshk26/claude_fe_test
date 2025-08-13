import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (dailyReportLog: Record<string, any>) => ({
	label: dailyReportLog.transactionNo || dailyReportLog.refundReceiptNo,
	value: dailyReportLog.id,
	metadata: {
		transactionType: dailyReportLog.transactionType,
		subLabel: dailyReportLog.transactionType
	}
})

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		const search = url.searchParams.get('search')?.trim()

		const where = {} as Record<string, unknown>
		if (search) {
			const multipleSearches = search.split(',')
			if (multipleSearches.length > 1) {
				where.OR = [
					{ id: { in: multipleSearches, mode: `insensitive` } },
					{ transactionNo: { in: multipleSearches, mode: `insensitive` } },
					{ refundReceiptNo: { in: multipleSearches, mode: `insensitive` } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ transactionNo: { contains: search, mode: `insensitive` } },
					{ refundReceiptNo: { contains: search, mode: `insensitive` } }
				]
			}
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_DAILY_REPORT_LOGS($where: DailyReportLogWhereInput, $orderBy: [DailyReportLogOrderByInput!]) {
					getAllDailyReportLogs(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ transactionNo: 'asc' }, { refundReceiptNo: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllDailyReportLogs.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
