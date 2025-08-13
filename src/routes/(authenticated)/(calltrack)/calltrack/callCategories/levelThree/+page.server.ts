import { redirect } from '@sveltejs/kit'

import loadCallCategoriesLevelThree from '$lib/server/loadCallCategoriesLevelThree'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_THREE'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadCallCategoriesLevelThree({
		fetch,
		url
	})
}
