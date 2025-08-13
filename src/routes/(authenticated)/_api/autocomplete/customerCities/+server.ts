import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	try {
		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_ALL_CUSTOMER_CITIES {
					getAllCustomerCities
				}
			`
		})

		if (errors) {
			return json([])
		}

		const cities = data.getAllCustomerCities as string[]

		return json(cities.map((city) => ({ label: city.replaceAll('_', ' '), value: city })))
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
