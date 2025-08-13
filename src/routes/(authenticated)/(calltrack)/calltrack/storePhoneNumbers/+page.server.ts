import { redirect } from '@sveltejs/kit'

import loadStorePhoneNumbers from '$lib/server/loadStorePhoneNumbers'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_STORE_PHONE_NUMBERS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadStorePhoneNumbers({
		fetch,
		url
	})
}
