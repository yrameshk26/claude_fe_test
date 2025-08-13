import { redirect } from '@sveltejs/kit'

import loadNameDetails from '$lib/server/loadNameDetails'
import { getTicketSubjectFilters } from '$lib/utils/filters'

export async function load({ fetch, url, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_TICKET_SUBJECTS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadNameDetails({
		queryName: 'GET_ALL_TICKET_SUBJECTS',
		query: 'getAllTicketSubjects',
		fetch,
		url,
		getFiltersFn: getTicketSubjectFilters
	})
}
