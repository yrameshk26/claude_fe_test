import { redirect } from '@sveltejs/kit'

import loadLoginApprovals from '$lib/server/loadLoginApprovals'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_LOGIN_APPROVALS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadLoginApprovals({
		fetch,
		url
	})
}
