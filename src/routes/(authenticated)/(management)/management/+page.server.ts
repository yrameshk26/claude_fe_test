import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load() {
	redirect(307, '/management/activities?createdBy=me')
}

export const actions = {
	dismissAnnouncement: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation DISMISS_ANNOUNCEMENT($id: ID!) {
					markAnnouncementAsRead(id: $id)
				}
			`,
			variables: {
				id: formData.get('id')
			}
		})
		console.log('errors', errors)
		if (errors) {
			return fail(422, { errors })
		}
	},
	sendNewAnnouncement: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation SEND_ANNOUNCEMENT($message: String!) {
					sendAnnouncement(message: $message)
				}
			`,
			variables: {
				message: formData.get('message')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
