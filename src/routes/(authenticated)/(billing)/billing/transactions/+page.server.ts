import { redirect } from '@sveltejs/kit'

import loadTransactions from '$lib/server/loadTransactions'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_TRANSACTIONS' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadTransactions({
		fetch,
		url
	})
}
