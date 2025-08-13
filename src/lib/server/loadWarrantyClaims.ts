import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import { getWarrantyClaimFilters } from '$lib/utils/filters'
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
		const searchTerms = getWarrantyClaimFilters()
		if (url.pathname.includes('wholesale/products')) {
			delete searchTerms.product
			delete searchTerms.productID
		}
		const where = { ...defaultWhereFilter }
		const AND = searchQueriesToPrismaQuery(url, searchTerms)
		if (AND.length) {
			where.AND = AND
		}
		const status = url.searchParams.get('status')
		if (status) {
			where.status = { equals: status }
		}

		// handle sorting
		const sortTerms = {
			returnedDate: null,
			status: null,
			createdByUser: 'fullName',
			notes: '_count'
		}
		const sortBy = sortTermsToPrismaQuery(url, sortTerms) as Record<string, unknown>[]
		if (sortBy.length === 0) {
			sortBy.push({ returnedDate: `desc` })
			sortBy.push({ status: `asc` })
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
		query GET_ALL_WARRANTY_CLAIMS($where: WarrantyClaimWhereInput, $orderBy: [WarrantyClaimOrderByInput!], $skip: Int, $take: Int, $persistentWhere: WarrantyClaimWhereInput) {
			getAllWarrantyClaims(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
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
			filterCount: data.getAllWarrantyClaims.metrics.filteredCount,
			totalCount: data.getAllWarrantyClaims.metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			warrantyClaims: data.getAllWarrantyClaims.data,
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
