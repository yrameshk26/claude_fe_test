import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	addCustomerNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ADD_CUSTOMER_NOTE($customerID: String!, $details: String!) {
          createNote(customerID: $customerID, details: $details)
        }
      `,
			variables: {
				customerID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addServiceNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_SERVICE_NOTE($serviceID: String!, $details: String!) {
					createNote(serviceID: $serviceID, details: $details)
				}
			`,
			variables: {
				serviceID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addTransactionNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_TRANSACTION_NOTE($transactionID: String!, $details: String!) {
					createNote(transactionID: $transactionID, details: $details)
				}
			`,
			variables: {
				transactionID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addTicketNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_TICKET_NOTE($ticketID: String!, $details: String!) {
					createNote(ticketID: $ticketID, details: $details)
				}
			`,
			variables: {
				ticketID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addDailyReportLogNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_DAILY_REPORT_LOG_NOTE($dailyReportLogID: String!, $details: String!) {
					createNote(dailyReportLogID: $dailyReportLogID, details: $details)
				}
			`,
			variables: {
				dailyReportLogID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addWarrantyClaimNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_WARRANTY_CLAIM_NOTE($warrantyClaimID: String!, $details: String!) {
					createNote(warrantyClaimID: $warrantyClaimID, details: $details)
				}
			`,
			variables: {
				warrantyClaimID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addProductNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_PRODUCT_NOTE($productID: String!, $details: String!) {
					createNote(productID: $productID, details: $details)
				}
			`,
			variables: {
				productID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addCallRecordNote: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation ADD_CALL_RECORD_NOTE($callRecordID: String!, $details: String!) {
					createNote(callRecordID: $callRecordID, details: $details)
				}
			`,
			variables: {
				callRecordID: formData.get('id'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
