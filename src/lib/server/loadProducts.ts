import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import { getProductFilters } from '$lib/utils/filters'
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
		const searchTerms = getProductFilters()
		if (url.pathname.includes('wholesale/vendors')) {
			delete searchTerms.vendor
			delete searchTerms.vendorID
			delete searchTerms.vendorInvoiceNo
			delete searchTerms.vendorPurchaseDt
			delete searchTerms.vendorWarrantyExpiryDt
		}
		if (url.pathname.includes('wholesale/resellers')) {
			delete searchTerms.reseller
			delete searchTerms.resellerID
			delete searchTerms.resellerInvoiceNo
			delete searchTerms.resellerPurchaseDt
			delete searchTerms.resellerWarrantyExpiryDt
		}
		const where = { ...defaultWhereFilter }
		const AND = searchQueriesToPrismaQuery(url, searchTerms)
		if (AND.length) {
			where.AND = AND
		}

		// handle sorting
		const sortTerms = {
			productType: 'name',
			vendor: 'name',
			reseller: 'name',
			warrantyClaims: '_count',
			notes: '_count'
		}
		const sortBy = sortTermsToPrismaQuery(url, sortTerms) as Record<string, unknown>[]
		if (sortBy.length === 0) {
			sortBy.push({ createdAt: `desc` })
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
		query GET_ALL_PRODUCTS($where: ProductWhereInput, $orderBy: [ProductOrderByInput!], $skip: Int, $take: Int, $persistentWhere: ProductWhereInput) {
			getAllProducts(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
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
			filterCount: data.getAllProducts.metrics.filteredCount,
			totalCount: data.getAllProducts.metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			products: data.getAllProducts.data,
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
