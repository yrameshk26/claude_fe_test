import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ fetch, url }) => {
	const customerID = url.searchParams.get('customerID')
	const serviceID = url.searchParams.get('serviceID')
	const transactionID = url.searchParams.get('transactionID')
	const ticketID = url.searchParams.get('ticketID')
	const dailyReportLogID = url.searchParams.get('dailyReportLogID')
	const warrantyClaimID = url.searchParams.get('warrantyClaimID')
	const productID = url.searchParams.get('productID')
	const callRecordID = url.searchParams.get('callRecordID')

	const where = {} as Record<string, unknown>

	if (customerID) {
		where.customerID = { equals: customerID }
	}
	if (serviceID) {
		where.serviceID = { equals: serviceID }
	}
	if (transactionID) {
		where.transactionID = { equals: transactionID }
	}
	if (ticketID) {
		where.ticketID = { equals: ticketID }
	}
	if (dailyReportLogID) {
		where.dailyReportLogID = { equals: dailyReportLogID }
	}
	if (warrantyClaimID) {
		where.warrantyClaimID = { equals: warrantyClaimID }
	}
	if (productID) {
		where.productID = { equals: productID }
	}
	if (callRecordID) {
		where.callRecordID = { equals: callRecordID }
	}
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
		query GET_ALL_NOTES($where: NotesWhereInput, $orderBy: [NotesOrderByInput!], $skip: Int, $take: Int, $persistentWhere: NotesWhereInput) {
			getAllNotes(where: $where, orderBy: $orderBy, skip: $skip, take: $take, persistentWhere: $persistentWhere)
		}
	`,
		variables: {
			where,
			orderBy: [{ createdAt: 'desc' }],
			take: 50
		}
	})

	if (errors) {
		return json({ errors })
	}

	return json(data.getAllNotes.data)
}
