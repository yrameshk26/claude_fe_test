import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import { getCallRecordFilters } from '$lib/utils/filters'
import {
	searchQueriesToPrismaQuery,
	sortTermsToPrismaQuery
} from '$sveltewind/components/filters/Search.svelte'

export default async function load({
	fetch: fetchFunction,
	defaultWhereFilter = {},
	url,
	locals
}: {
	fetch: typeof fetch
	defaultWhereFilter?: Record<string, unknown>
	url: URL
	locals: App.Locals
}) {
	try {
		const canViewAllCallRecords =
			locals.session.isAdmin ||
			!!locals.session.permissions.find(
				({ permissionType }) => permissionType === 'VIEW_ALL_CALL_RECORDS'
			)
		const createdBy = url.searchParams.get('createdBy')

		// handle filtering
		const searchTerms = getCallRecordFilters()
		if (!canViewAllCallRecords || createdBy === 'me') {
			delete searchTerms.createdByUser
			delete searchTerms.createdBy
			delete searchTerms.updatedByUser
			delete searchTerms.updatedBy
		}
		const where = { ...defaultWhereFilter }
		const AND = searchQueriesToPrismaQuery(url, searchTerms)
		if (AND.length) {
			where.AND = AND
		}

		if (createdBy === 'me' || !canViewAllCallRecords) {
			where.createdBy = { equals: locals.session.id }
		}

		// handle sorting
		const sortTerms = {
			startTime: null,
			endTime: null,
			duration: null,
			customerWaitSeconds: null,
			createdByUser: 'fullName',
			callType: null,
			callCategoryLevelOne: 'name',
			callCategoryLevelTwo: 'name',
			callCategoryLevelThree: 'name',
			productType: 'name',
			serviceType: 'name',
			notes: '_count'
		}
		const sortBy = sortTermsToPrismaQuery(url, sortTerms) as Record<string, unknown>[]
		if (sortBy.length === 0) {
			sortBy.push({ startTime: `desc` })
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
		query GET_ALL_CALL_RECORDS($where: CallRecordWhereInput, $orderBy: [CallRecordOrderByInput!], $skip: Int, $take: Int, $persistentWhere: CallRecordWhereInput) {
			getAllCallRecords(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
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
			filterCount: data.getAllCallRecords.metrics.filteredCount,
			totalCount: data.getAllCallRecords.metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			callRecords: data.getAllCallRecords.data,
			summary,
			searchTerms,
			canViewAllCallRecords
		}
	} catch (error) {
		console.error(error)
		if (error instanceof Error) {
			Sentry.captureException(error)
		}
		return redirect(307, '/error')
	}
}
