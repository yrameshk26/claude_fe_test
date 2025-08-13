import { redirect } from '@sveltejs/kit'

import loadCallRecords from '$lib/server/loadCallRecords'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_ALL_CALL_RECORDS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadCallRecords({
		fetch,
		url,
		locals,
		defaultWhereFilter: {
			duration: { equals: null }
		}
	})
}
