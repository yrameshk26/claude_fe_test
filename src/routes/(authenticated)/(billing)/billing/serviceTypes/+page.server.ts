import { redirect } from '@sveltejs/kit'

import loadServiceTypes from '$lib/server/loadServiceTypes'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_SERVICE_TYPES' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadServiceTypes({
		fetch,
		url
	})
}
