import { redirect } from '@sveltejs/kit'

import loadProducts from '$lib/server/loadProducts'

export async function load({ fetch, locals, url, params }) {
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
		url,
		defaultWhereFilter: {
			vendorID: { equals: params.id }
		}
	})
}
