import { redirect } from '@sveltejs/kit'

import loadCallCategoriesLevelOne from '$lib/server/loadCallCategoriesLevelOne'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_ONE'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadCallCategoriesLevelOne({
		fetch,
		url
	})
}
