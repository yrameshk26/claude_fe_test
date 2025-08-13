import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	try {
		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
				query GET_ALL_PERMISSION_TYPES {
					getAllPermissionTypes
				}
			`
		})

		if (errors) {
			return json([])
		}

		const permissions = Object.entries(data.getAllPermissionTypes) as [
			string,
			{ permissions: string[] }
		][]

		const flattenedPermissions = permissions
			.map(([, { permissions }]) =>
				Object.values(permissions)
					.flat()
					.map((permission) => permission)
			)
			.flat()

		return json(
			flattenedPermissions.map((type) => ({ label: type.replaceAll('_', ' '), value: type }))
		)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json([])
	}
}
