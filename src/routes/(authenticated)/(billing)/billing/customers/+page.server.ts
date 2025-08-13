import { redirect } from '@sveltejs/kit'

import loadCustomers from '$lib/server/loadCustomers'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_CUSTOMERS' && app === 'BILLING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadCustomers({
		fetch,
		url,
		defaultWhereFilter: { isDeleted: { equals: false } }
	})
}
