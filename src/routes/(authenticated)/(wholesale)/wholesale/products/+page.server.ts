import { redirect } from '@sveltejs/kit'

import loadProducts from '$lib/server/loadProducts'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_PRODUCTS' && app === 'WHOLESALE'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadProducts({
		fetch,
		url
	})
}
