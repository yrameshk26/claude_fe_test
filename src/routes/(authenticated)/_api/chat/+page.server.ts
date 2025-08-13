import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	broadcastChatMessage: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation BROADCAST_CHAT_MESSAGE($message: String!) {
          broadcastChatMessage(message: $message)
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
