import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction, realtime } from '$lib/utils'

export const actions = {
	sendChatMessage: async ({ request, fetch, params, locals }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation SEND_CHAT_MESSAGE($conversationID: String!, $toUserID: String!, $message: String!) {
          sendChatMessage(conversationID: $conversationID, toUserID: $toUserID, message: $message)
        }
      `,
			variables: {
				conversationID: formData.get('conversationID'),
				toUserID: params.toUserID,
				message: formData.get('message')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}

		try {
			realtime.publisher.publish(
				'CHAT',
				JSON.stringify({
					FINGERPRINT: locals.session.cookies['TVUPWEB_FINGERPRINT'],
					authUserID: locals.session.id,
					authUserFullName: locals.session.fullName,
					authUserImage: locals.session.imageUrl,
					mutationName: 'SEND_CHAT_MESSAGE',
					AUTH_SESSION_ID: locals.session.cookies['TVUPWEB_AUTH_SESSION_ID'],
					conversationID: formData.get('conversationID'),
					toUserID: params.toUserID,
					message: formData.get('message')
				})
			)
		} catch (error) {
			console.error('Error sending realtime event', error)
		}

		return result.sendChatMessage
	}
} satisfies Actions
