import { redirect } from '@sveltejs/kit'

import loadServiceTypeUrls from '$lib/server/loadServiceTypeUrls'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_SERVICE_TYPE_URLS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadServiceTypeUrls({
		fetch,
		url
	})
}
