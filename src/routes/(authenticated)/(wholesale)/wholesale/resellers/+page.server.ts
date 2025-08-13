import { redirect } from '@sveltejs/kit'

import loadWholesalers from '$lib/server/loadWholesalers'
import { getResellerFilters } from '$lib/utils/filters'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_RESELLERS' && app === 'WHOLESALE'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadWholesalers({
		fetch,
		url,
		model: 'Reseller',
		queryName: 'GET_ALL_RESELLERS',
		query: 'getAllResellers',
		getFiltersFn: getResellerFilters
	})
}
