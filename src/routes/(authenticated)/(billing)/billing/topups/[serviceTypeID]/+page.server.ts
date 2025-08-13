import { redirect } from '@sveltejs/kit'

import loadTodaysTopupServices from '$lib/server/loadTodaysTopupServices'

export async function load({ params, fetch, url, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_TOPUPS' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadTodaysTopupServices({
		fetch,
		url,
		serviceTypeID: params.serviceTypeID
	})
}
