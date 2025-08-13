import { redirect } from '@sveltejs/kit'

import loadSessions from '$lib/server/loadSessions'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_STAFF_SESSIONS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadSessions({
		fetch,
		url
	})
}
