import { redirect } from '@sveltejs/kit'

import loadDailyReportLogs from '$lib/server/loadDailyReportLogs'

export async function load({ fetch, locals, url }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) =>
				permissionType === 'VIEW_DAILY_REPORT_LOGS' && app === 'ACCOUNTING'
		)
	) {
		redirect(307, '/unauthorized')
	}

	return loadDailyReportLogs({
		fetch,
		url
	})
}
