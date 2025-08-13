import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (service: Record<string, any>) => ({
	label: service.macID || service.accountNumber,
	value: service.id
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
					{ accountNumber: { in: multipleSearches, mode: `insensitive` } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ macID: { startsWith: search, mode: `insensitive` } },
					{ accountNumber: { startsWith: search, mode: `insensitive` } }
				]
			}
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_SERVICES($where: ServiceWhereInput, $orderBy: [ServiceOrderByInput!]) {
					getAllServices(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ macID: 'asc' }, { accountNumber: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllServices.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
