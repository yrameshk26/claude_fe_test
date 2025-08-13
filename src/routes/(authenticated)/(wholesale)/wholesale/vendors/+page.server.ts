import { redirect } from '@sveltejs/kit'

import loadWholesalers from '$lib/server/loadWholesalers'
import { getVendorFilters } from '$lib/utils/filters'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_VENDORS' && app === 'WHOLESALE'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadWholesalers({
		fetch,
		url,
		model: 'Vendor',
		queryName: 'GET_ALL_VENDORS',
		query: 'getAllVendors',
		getFiltersFn: getVendorFilters
	})
}
