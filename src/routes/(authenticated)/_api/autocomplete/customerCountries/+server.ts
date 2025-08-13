import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	try {
		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_ALL_CUSTOMER_COUNTRIES {
					getAllCustomerCountries
				}
			`
		})

		if (errors) {
			return json([])
		}

		const countries = data.getAllCustomerCountries as string[]

		return json(
			countries.map((country) => ({ label: country.replaceAll('_', ' '), value: country }))
		)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
