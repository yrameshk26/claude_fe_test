import { redirect } from '@sveltejs/kit'

import loadNameDetails from '$lib/server/loadNameDetails'
import { getTerminalFilters } from '$lib/utils/filters'
export async function load({ fetch, url, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_TERMINALS' && app === 'ACCOUNTING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadNameDetails({
		queryName: 'GET_ALL_TERMINALS',
		query: 'getAllTerminals',
		fetch,
		url,
		getFiltersFn: getTerminalFilters
	})
}
