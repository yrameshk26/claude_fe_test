import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import type { SearchTermsType } from '$sveltewind/components/filters/Search.svelte'

import {
	searchQueriesToPrismaQuery,
	sortTermsToPrismaQuery
} from '$sveltewind/components/filters/Search.svelte'

export default async function load({
	queryName,
	query,
	fetch: fetchFunction,
	defaultWhereFilter = {},
	url,
	getFiltersFn
}: {
	queryName: string
	query: string
	fetch: typeof fetch
	defaultWhereFilter?: Record<string, unknown>
	url: URL
	getFiltersFn: () => SearchTermsType
}) {
	try {
		// handle filtering
		const searchTerms = getFiltersFn()
		const where = { ...defaultWhereFilter }
		const AND = searchQueriesToPrismaQuery(url, searchTerms)
		if (AND.length) {
			where.AND = AND
		}

		// handle sorting
		const sortTerms = {
			name: null,
			details: null,
			customers: '_count',
			services: '_count',
			callRecords: '_count',
			products: '_count',
			transactions: '_count',
			tickets: '_count',
			dailyReportLogs: '_count',
			payments: '_count',
			updatedAt: null,
			createdAt: null
		}
		const sortBy = sortTermsToPrismaQuery(url, sortTerms) as Record<string, unknown>[]
		if (sortBy.length === 0) {
			sortBy.push({ name: `asc` })
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
		query ${queryName}($where: NameDetailsCommonWhereInput, $orderBy: [NameDetailsCommonOrderByInput!], $skip: Int, $take: Int, $persistentWhere: NameDetailsCommonWhereInput) {
			${query}(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
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
			filterCount: data[query].metrics.filteredCount,
			totalCount: data[query].metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			records: data[query].data,
			summary,
			searchTerms
		}
	} catch (error) {
		console.error(error)
		if (error instanceof Error) {
			Sentry.captureException(error)
		}
		return redirect(307, '/error')
	}
}
