import { redirect } from '@sveltejs/kit'

import loadUsers from '$lib/server/loadUsers'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'VIEW_STAFFS')
	) {
		redirect(307, '/unauthorized')
	}

	return loadUsers({
		fetch,
		url,
		defaultWhereFilter: { isDeleted: { equals: false } }
	})
}
