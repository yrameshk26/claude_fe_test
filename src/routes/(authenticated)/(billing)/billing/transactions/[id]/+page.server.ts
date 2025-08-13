import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { transaction, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		transaction
	}
}

export const actions = {
	updateTransactionDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TRANSACTION_CREATED_DATE($id: String!, $date: Date!) {
          updateTransactionDate(id: $id, date: $date)
        }
      `,
			variables: {
				id: params.id,
				date: formData.get('date')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTransactionNumber: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TRANSACTION_NUMBER($id: String!, $transactionNumber: String!) {
          updateTransactionNumber(id: $id, transactionNumber: $transactionNumber)
        }
      `,
			variables: {
				id: params.id,
				transactionNumber: formData.get('transactionNumber')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTransactionType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TRANSACTION_TRANSACTION_TYPE($id: String!, $transactionType: TransactionType!) {
          updateTransactionType(id: $id, transactionType: $transactionType)
        }
      `,
			variables: {
				id: params.id,
				transactionType: formData.get('transactionType')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTransactionShipment: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TRANSACTION_SHIPMENT($id: String!, $shipmentID: String) {
          updateTransactionShipment(id: $id, shipmentID: $shipmentID)
        }
      `,
			variables: {
				id: params.id,
				shipmentID: formData.get('shipmentID') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTransactionIsFromCall: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_TRANSACTION_IS_FROM_CALL($id: String!, $isFromCall: Boolean!) {
					updateTransactionIsFromCall(id: $id, isFromCall: $isFromCall)
				}
			`,
			variables: {
				id: params.id,
				isFromCall: formData.get('isFromCall') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteTransaction: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_TRANSACTION($id: String!) {
          deleteTransaction(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/billing/transactions')
	}
} satisfies Actions
