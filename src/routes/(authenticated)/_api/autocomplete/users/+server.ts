import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (user: Record<string, any>) => ({
	label: user.fullName,
	value: user.id,
	metadata: {
		imageUrl: user.imageUrl
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
					{ fullName: { in: multipleSearches, mode: `insensitive` } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ fullName: { contains: search, mode: `insensitive` } }
				]
			}
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_USERS($where: UserWhereInput, $orderBy: [UserOrderByInput!]) {
					getAllUsers(where: $where, orderBy: $orderBy, isLean: true)
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

		const result = data.getAllUsers.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
