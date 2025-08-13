import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

const mapToAutocompleteItem = (serviceTypeUrl: Record<string, any>) => ({
	label: serviceTypeUrl.urlName,
	value: serviceTypeUrl.id,
	metadata: {
		url: serviceTypeUrl.url,
		subLabel: serviceTypeUrl.url
	}
})

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
		const search = url.searchParams.get('search')?.trim()
		const serviceTypeID = url.searchParams.get('serviceTypeID')

		const where = {} as Record<string, unknown>
		if (search) {
			const multipleSearches = search.split(',')
			if (multipleSearches.length > 1) {
				where.OR = [
					{ id: { in: multipleSearches, mode: `insensitive` } },
					{ urlName: { in: multipleSearches, mode: `insensitive` } },
					{ url: { in: multipleSearches, mode: `insensitive` } }
				]
			} else {
				where.OR = [
					{ id: { equals: search, mode: `insensitive` } },
					{ urlName: { startsWith: search, mode: `insensitive` } },
					{ url: { startsWith: search, mode: `insensitive` } }
				]
			}
		}
		if (serviceTypeID) {
			where.serviceTypeID = { equals: serviceTypeID }
		}

		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_LEAN_SERVICE_TYPE_URLS($where: ServiceTypeUrlWhereInput, $orderBy: [ServiceTypeUrlOrderByInput!]) {
					getAllServiceTypeUrls(where: $where, orderBy: $orderBy, isLean: true)
				}
			`,
			variables: {
				where,
				orderBy: [{ urlName: 'asc' }]
			}
		})

		if (errors) {
			return json([])
		}

		const result = data.getAllServiceTypeUrls.data.map(mapToAutocompleteItem)

		return json(result)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
