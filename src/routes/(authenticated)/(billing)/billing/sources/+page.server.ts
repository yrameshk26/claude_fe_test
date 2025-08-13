import { redirect } from '@sveltejs/kit'

import loadNameDetails from '$lib/server/loadNameDetails'
import { getSourceFilters } from '$lib/utils/filters'

export async function load({ fetch, url, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_SOURCES' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadNameDetails({
		queryName: 'GET_ALL_SOURCES',
		query: 'getAllSources',
		fetch,
		url,
		getFiltersFn: getSourceFilters
	})
}
