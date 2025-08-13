import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'VIEW_REPORTS')
	) {
		redirect(307, '/unauthorized')
	}
}
