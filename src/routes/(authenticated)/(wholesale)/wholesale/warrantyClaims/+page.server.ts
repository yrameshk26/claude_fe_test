import { redirect } from '@sveltejs/kit'

import loadWarrantyClaims from '$lib/server/loadWarrantyClaims'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_WARRANTY_CLAIMS' && app === 'WHOLESALE'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadWarrantyClaims({
		fetch,
		url
	})
}
