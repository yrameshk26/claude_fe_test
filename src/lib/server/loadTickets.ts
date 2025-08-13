import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'
import { getTicketFilters } from '$lib/utils/filters'
import {
	searchQueriesToPrismaQuery,
	sortTermsToPrismaQuery
} from '$sveltewind/components/filters/Search.svelte'

export default async function load({
	fetch: fetchFunction,
	defaultWhereFilter = {},
	appName,
	url,
	locals
}: {
	fetch: typeof fetch

	defaultWhereFilter?: Record<string, any>
	appName?: 'BILLING' | 'ACCOUNTING'
	url: URL
	locals: App.Locals
}) {
	try {
		const canViewAllTickets =
			locals.session.isAdmin ||
			!!locals.session.permissions.find(
				({ app, permissionType }) =>
					permissionType === 'VIEW_ALL_TICKETS' && (!appName || app === appName)
			)
		const assignedTo = url.searchParams.get('assignedTo')

		// handle filtering
		const searchTerms = getTicketFilters()
		if (!canViewAllTickets || assignedTo === 'me') {
			delete searchTerms.assignedToUser
			delete searchTerms.assignedTo
		}
		if (url.pathname.includes('accounting/tickets')) {
			delete searchTerms.customer
			delete searchTerms.customerID
		}
		if (url.pathname.includes('billing/tickets')) {
			delete searchTerms.dailyReportLog
			delete searchTerms.dailyReportLogID
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

		if (assignedTo === 'me' || !canViewAllTickets) {
			where.OR = [
				{ assignedTo: { equals: locals.session.id } },
				{
					AND: [{ assignedTo: { equals: null } }, { assignedBy: { equals: locals.session.id } }]
				}
			]
		}

		const ticketType = url.searchParams.get('ticketType')
		if (ticketType === 'User') {
			where.OR = {
				AND: [{ customerID: { equals: null } }, { dailyReportLogID: { equals: null } }]
			}
		} else if (ticketType === 'Customer') {
			where.OR = {
				AND: [{ customerID: { not: null } }, { dailyReportLogID: { equals: null } }]
			}
		} else if (ticketType === 'DailyReportLog') {
			where.OR = {
				AND: [{ customerID: { equals: null } }, { dailyReportLogID: { not: null } }]
			}
		}

		// handle sorting
		const sortTerms = {
			createdAt: null,
			subject: 'name',
			assignedToUser: 'fullName',
			status: null,
			assignedByUser: 'fullName',
			expiresAt: null,
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
		query GET_ALL_TICKETS($where: TicketWhereInput, $orderBy: [TicketOrderByInput!], $skip: Int, $take: Int, $persistentWhere: TicketWhereInput) {
			getAllTickets(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
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
			filterCount: data.getAllTickets.metrics.filteredCount,
			totalCount: data.getAllTickets.metrics.allCount
		}

		// redirect to last page if page is out of range
		const totalPages = Math.ceil(summary.filterCount / limit)
		if (page !== 1 && page > totalPages) {
			const newSearchParams = new URLSearchParams(url.searchParams)
			newSearchParams.set('page', totalPages.toString())
			return redirect(307, `${url.pathname}?${newSearchParams.toString()}`)
		}

		return {
			tickets: data.getAllTickets.data,
			summary,
			searchTerms,
			canViewAllTickets
		}
	} catch (error) {
		console.error(error)
		if (error instanceof Error) {
			Sentry.captureException(error)
		}
		return redirect(307, '/error')
	}
}
