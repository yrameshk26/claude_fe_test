import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import { getDailyReportLogFilters } from '$lib/utils/filters'
import {
	searchQueriesToPrismaQuery,
	sortTermsToPrismaQuery
} from '$sveltewind/components/filters/Search.svelte'

export default async function load({
	fetch: fetchFunction,
	defaultWhereFilter = {},
	url
}: {
	fetch: typeof fetch
	defaultWhereFilter?: Record<string, unknown>
	url: URL
}) {
	try {
		// handle filtering
		const searchTerms = getDailyReportLogFilters()
		const where = { ...defaultWhereFilter }
		const AND = searchQueriesToPrismaQuery(url, searchTerms)
		if (AND.length) {
			where.AND = AND
		}
		const type = url.searchParams.get('type')
		if (type) {
			where.transactionType = { equals: type }
		}
		if (url.searchParams.get('duplicates') === 'true') {
			const [duplicateData, duplicateErrors] = await graphqlFetchAction({
				fetch: fetchFunction,
				query: `
					query GET_DUPLICATE_RECORDS_BY_MODEL($model: String!, $columns: [String!]!) {
						getAllDuplicateRecordsByModel(model: $model, columns: $columns)
					}
				`,
				variables: {
					model: 'DailyReportLog',
					columns: ['transactionNo', 'refundReceiptNo', 'receivingPaymentNo']
				}
			})

			if (duplicateErrors) {
				throw new Error(duplicateErrors)
			}
			const records = duplicateData.getAllDuplicateRecordsByModel as {
				id: string
				processedDate: string
				transactionNo: string
				refundReceiptNo: string
				receivingPaymentNo: string
			}[]
			const ids = records.map((r) => r.id)
			where.id = { in: ids }
		}

		// handle sorting
		const sortTerms = {
			processedDate: null,
			number: null,
			transactionType: null,
			company: 'name',
			totalAmount: null,
			salesPerson: 'fullName',
			tickets: '_count',
			notes: '_count'
		}
		const sortBy = sortTermsToPrismaQuery(url, sortTerms) as Record<string, unknown>[]
		if (url.searchParams.get('duplicates') === 'true') {
			sortBy.push({ number: `asc` })
		}
		if (sortBy.length === 0) {
			sortBy.push({ processedDate: `desc` })
			sortBy.push({ number: `asc` })
		}
		if (sortBy.find((sort) => sort['number'])) {
			const index = sortBy.findIndex((sort) => sort['number'])
			const sortOrder = sortBy[index]['number']
			sortBy[index] = { transactionNo: sortOrder } as {
				transactionNo: string
			}
			sortBy.push({ refundReceiptNo: sortOrder } as { refundReceiptNo: string })
			sortBy.push({ receivingPaymentNo: sortOrder } as { receivingPaymentNo: string })
		}

		// handle pagination
		const page = parseInt(url.searchParams.get('page') || '1')
		if (page < 1 || isNaN(page)) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.delete('page', '1')
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}
		const limit = parseInt(url.searchParams.get('limit') || '25')
		const skip = (page - 1) * limit

		// run query
		const [data, errors] = await graphqlFetchAction({
			fetch: fetchFunction,
			query: `
		query GET_ALL_DAILY_REPORT_LOGS($where: DailyReportLogWhereInput, $orderBy: [DailyReportLogOrderByInput!], $skip: Int, $take: Int, $persistentWhere: DailyReportLogWhereInput) {
			getAllDailyReportLogs(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
		}
	`,
			variables: {
				where,
				orderBy: sortBy,
				skip,
				take: limit,
				persistentWhere: defaultWhereFilter
			}
		})

		if (errors) {
			return { errors }
		}

		// get summary
		const summary = {
			filterCount: data.getAllDailyReportLogs.metrics.filteredCount,
			totalCount: data.getAllDailyReportLogs.metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			dailyReportLogs: data.getAllDailyReportLogs.data,
			summary,
			searchTerms,
			totalAmount: data.getAllDailyReportLogs.totalAmount
		}
	} catch (error) {
		console.error(error)
		if (error instanceof Error) {
			Sentry.captureException(error)
		}
		return redirect(307, '/error')
	}
}
