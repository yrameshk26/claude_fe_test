import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (customer: Record<string, any>) => ({
	label: customer.fullName,
	value: customer.id,
	metadata: {
		subLabel: customer.phoneNumbers?.[0]?.value
	}
})

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		const search = url.searchParams.get('search')?.trim()

		const where = { isDeleted: { equals: false } } as Record<string, unknown>
		if (search) {
			const multipleSearches = search.split(',')
			if (multipleSearches.length > 1) {
				where.OR = [
					{ id: { in: multipleSearches, mode: `insensitive` } },
					{ fullName: { in: multipleSearches, mode: `insensitive` } },
					{ phoneNumbers: { some: { value: { in: multipleSearches, mode: `insensitive` } } } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ fullName: { contains: search, mode: `insensitive` } },
					{ phoneNumbers: { some: { value: { startsWith: search, mode: `insensitive` } } } }
				]
			}
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_CUSTOMERS($where: CustomerWhereInput, $orderBy: [CustomerOrderByInput!]) {
					getAllCustomers(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ fullName: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllCustomers.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
