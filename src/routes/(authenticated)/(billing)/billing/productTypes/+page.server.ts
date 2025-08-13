import { redirect } from '@sveltejs/kit'

import loadNameDetails from '$lib/server/loadNameDetails'
import { getProductTypeFilters } from '$lib/utils/filters'

export async function load({ fetch, url, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_PRODUCT_TYPES'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadNameDetails({
		queryName: 'GET_ALL_PRODUCT_TYPES',
		query: 'getAllProductTypes',
		fetch,
		url,
		getFiltersFn: getProductTypeFilters
	})
}
