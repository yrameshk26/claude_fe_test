import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (product: Record<string, any>) => ({
	label: product.macID || product.serialNo,
	value: product.id,
	metadata: {
		macID: product.macID,
		serialNo: product.serialNo,
		subLabel: [product.serialNo, product.macID].join(', ')
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
					{ macID: { in: multipleSearches, mode: `insensitive` } },
					{ serialNo: { in: multipleSearches, mode: `insensitive` } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ macID: { startsWith: search, mode: `insensitive` } },
					{ serialNo: { startsWith: search, mode: `insensitive` } }
				]
			}
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_PRODUCTS($where: ProductWhereInput, $orderBy: [ProductOrderByInput!]) {
					getAllProducts(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ macID: 'asc' }, { serialNo: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllProducts.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
