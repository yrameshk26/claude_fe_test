import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (callCategoryLevelTwo: Record<string, any>) => ({
	label: callCategoryLevelTwo.name,
	value: callCategoryLevelTwo.id,
	metadata: {
		callCategoryLevelOne: callCategoryLevelTwo.callCategoryLevelOne,
		subLabel: callCategoryLevelTwo.callCategoryLevelOne?.name
	}
})

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		const search = url.searchParams.get('search')?.trim()
		const callCategoryLevelOneID = url.searchParams.get('callCategoryLevelOneID')

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
		if (callCategoryLevelOneID) {
			where.callCategoryLevelOneID = { equals: callCategoryLevelOneID }
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_CALL_CATEGORY_LEVEL_TWO($where: CallCategoryLevelTwoWhereInput, $orderBy: [CallCategoryLevelTwoOrderByInput!]) {
					getAllCallCategoriesLevelTwo(where: $where, orderBy: $orderBy, isLean: true)
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

		const result = data.getAllCallCategoriesLevelTwo.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
