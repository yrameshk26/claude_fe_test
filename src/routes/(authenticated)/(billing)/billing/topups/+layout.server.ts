import { redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_TOPUPS' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	const [serviceTypesData, serviceTypesErrors] = await graphqlFetchAction({
		fetch,
		query: `
				query GET_ALL_SERVICE_TYPES($orderBy: [ServiceTypeOrderByInput!], $take: Int) {
					getAllServiceTypes(orderBy: $orderBy, take: $take)
				}
			`,
		variables: {
			orderBy: [{ order: `asc` }, { name: `asc` }],
			take: 1000
		}
	})

	if (serviceTypesErrors) {
		return { errors: serviceTypesErrors }
	}

	const [topupsCountData, topupsCountErrors] = await graphqlFetchAction({
		fetch,
		query: `
				query GET_TODAYS_TOPUP_COUNTS {
					getTodaysTopupCounts
				}
			`
	})

	if (topupsCountErrors) {
		return { errors: topupsCountErrors }
	}

	return {
		serviceTypes: serviceTypesData.getAllServiceTypes.data,
		topupsCount: topupsCountData.getTodaysTopupCounts
	}
}
