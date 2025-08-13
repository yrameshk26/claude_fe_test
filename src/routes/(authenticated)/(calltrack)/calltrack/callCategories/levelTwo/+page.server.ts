import { redirect } from '@sveltejs/kit'

import loadCallCategoriesLevelTwo from '$lib/server/loadCallCategoriesLevelTwo'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_TWO'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadCallCategoriesLevelTwo({
		fetch,
		url
	})
}
