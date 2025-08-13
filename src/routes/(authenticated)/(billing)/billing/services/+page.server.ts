import { redirect } from '@sveltejs/kit'

import loadServices from '$lib/server/loadServices'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_SERVICES' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadServices({
		fetch,
		url
	})
}
