import { redirect } from '@sveltejs/kit'

import loadTransactions from '$lib/server/loadTransactions'

export async function load({ fetch, locals, url, params }) {
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
		url,
		defaultWhereFilter: {
			customer: { id: { equals: params.id } }
		}
	})
}
