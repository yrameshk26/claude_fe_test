import { redirect } from '@sveltejs/kit'

export async function load() {
	redirect(307, '/accounting/tickets?status=OPEN&assignedTo=me')
}
