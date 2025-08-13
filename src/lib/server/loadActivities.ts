import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import { getActivityFilters } from '$lib/utils/filters'
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

	defaultWhereFilter?: Record<string, any>
	url: URL
	locals: App.Locals
}) {
	try {
		const canViewAllActivities =
			locals.session.isAdmin ||
			!!locals.session.permissions.find(
				({ permissionType, app }) =>
					permissionType === 'VIEW_ALL_ACTIVITIES' &&
					(!defaultWhereFilter?.app?.equals ||
						(defaultWhereFilter?.app?.equals && app === defaultWhereFilter.app.equals))
			)
		const createdBy = url.searchParams.get('createdBy')

		// handle filtering
		const searchTerms = getActivityFilters()
		if (!canViewAllActivities || createdBy === 'me') {
			delete searchTerms.createdByUser
			delete searchTerms.createdBy
		}
		const where = { ...defaultWhereFilter }
		const AND = searchQueriesToPrismaQuery(url, searchTerms)
		if (AND.length) {
			where.AND = AND
		}

		if (createdBy === 'me' || !canViewAllActivities) {
			where.createdBy = { equals: locals.session.id }
		}

		// handle sorting
		const sortTerms = {
			date: null,
			type: null,
			createdByUser: 'fullName'
		}
		const sortBy = sortTermsToPrismaQuery(url, sortTerms) as Record<string, unknown>[]
		if (sortBy.length === 0) {
			sortBy.push({ date: `desc` })
			sortBy.push({ type: `asc` })
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
		query GET_ALL_ACTIVITIES($where: ActivityWhereInput, $orderBy: [ActivityOrderByInput!], $skip: Int, $take: Int, $persistentWhere: ActivityWhereInput) {
			getAllActivities(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
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
			filterCount: data.getAllActivities.metrics.filteredCount,
			totalCount: data.getAllActivities.metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			activities: data.getAllActivities.data,
			summary,
			searchTerms,
			canViewAllActivities
		}
	} catch (error) {
		console.error(error)
		if (error instanceof Error) {
			Sentry.captureException(error)
		}
		return redirect(307, '/error')
	}
}
