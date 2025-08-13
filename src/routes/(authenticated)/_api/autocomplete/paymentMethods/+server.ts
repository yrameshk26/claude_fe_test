import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (paymentMethod: Record<string, any>) => ({
	label: paymentMethod.name,
	value: paymentMethod.id,
	metadata: {
		isCard: paymentMethod.isCard,
		subLabel: paymentMethod.isCard ? 'Card' : ''
	}
})

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		const search = url.searchParams.get('search')?.trim()

		const where = {} as Record<string, unknown>
		if (search) {
			const multipleSearches = search.split(',')
			if (multipleSearches.length > 1) {
				where.OR = [
					{ id: { in: multipleSearches, mode: `insensitive` } },
					{ name: { in: multipleSearches, mode: `insensitive` } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ name: { startsWith: search, mode: `insensitive` } }
				]
			}
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_PAYMENT_METHODS($where: PaymentMethodWhereInput, $orderBy: [PaymentMethodOrderByInput!]) {
					getAllPaymentMethods(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ name: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllPaymentMethods.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
