import { redirect } from '@sveltejs/kit'

import loadServices from '$lib/server/loadServices'

export async function load({ fetch, locals, url, params }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'VIEW_SERVICES')
	) {
		redirect(307, '/unauthorized')
	}

	return loadServices({
		fetch,
		url,
		defaultWhereFilter: {
			customer: { id: { equals: params.id } }
		}
	})
}
