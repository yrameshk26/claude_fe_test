import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (transaction: Record<string, any>) => ({
	label: transaction.transactionNumber,
	value: transaction.id,
	metadata: {
		transactionType: transaction.transactionType,
		subLabel: transaction.transactionType
	}
})

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		const search = url.searchParams.get('search')?.trim()

		const where = { transactionType: { not: 'REVERSE' } } as Record<string, unknown>
		if (search) {
			where.transactionNumber = { startsWith: search, mode: `insensitive` }
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_TRANSACTIONS($where: TransactionWhereInput, $orderBy: [TransactionOrderByInput!]) {
					getAllTransactions(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ transactionNumber: 'asc' }, { transactionType: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllTransactions.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
