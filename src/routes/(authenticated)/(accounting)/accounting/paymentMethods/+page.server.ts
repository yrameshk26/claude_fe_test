import { redirect } from '@sveltejs/kit'

import loadPaymentMethods from '$lib/server/loadPaymentMethods'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'VIEW_PAYMENT_METHODS' && app === 'ACCOUNTING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadPaymentMethods({
		fetch,
		url
	})
}
