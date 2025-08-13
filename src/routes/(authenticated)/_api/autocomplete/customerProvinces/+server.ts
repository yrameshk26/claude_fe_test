import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	try {
		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_ALL_CUSTOMER_PROVINCES {
					getAllCustomerProvinces
				}
			`
		})

		if (errors) {
			return json([])
		}

		const provinces = data.getAllCustomerProvinces as string[]

		return json(
			provinces.map((province) => ({ label: province.replaceAll('_', ' '), value: province }))
		)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
