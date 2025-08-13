import { redirect } from '@sveltejs/kit'

import loadNameDetails from '$lib/server/loadNameDetails'
import { getShipmentFilters } from '$lib/utils/filters'

export async function load({ fetch, url, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_SHIPMENTS' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadNameDetails({
		queryName: 'GET_ALL_SHIPMENTS',
		query: 'getAllShipments',
		fetch,
		url,
		getFiltersFn: getShipmentFilters
	})
}
