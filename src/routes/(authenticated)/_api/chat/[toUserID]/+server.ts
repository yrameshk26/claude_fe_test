import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

import { graphqlFetchAction, realtime } from '$lib/utils'

export const GET: RequestHandler = async ({ fetch, params, locals, url }) => {
	const toUserID = params.toUserID

	let conversationID = url.searchParams.get('conversationID')
	const markAsRead = url.searchParams.get('markAsRead') === 'true'

	if (conversationID === 'undefined') {
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation START_CONVERSATION($toUserID: String!) {
          startConversation(toUserID: $toUserID)
        }
      `,
			variables: {
				toUserID
			}
		})

		if (errors) {
			return json({ errors })
		}
		conversationID = result.startConversation
	}

	// mark as read the conversation
	if (markAsRead) {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
      mutation MARK_CHAT_AS_READ($conversationID: String!) {
        markChatAsRead(conversationID: $conversationID)
      }
    `,
			variables: {
				conversationID
			}
		})

		if (errors) {
			return json({ errors })
		}

		realtime.publisher.publish(
			'APP_UPDATED_BY',
			JSON.stringify({
				FINGERPRINT: locals.session.cookies['TVUPWEB_FINGERPRINT'],
				authUserID: locals.session.id,
				mutationName: 'MARK_CHAT_AS_READ',
				AUTH_SESSION_ID: locals.session.cookies['TVUPWEB_AUTH_SESSION_ID']
			})
		)
	}

	// handle pagination
	let page = parseInt(url.searchParams.get('page') || '1')
	if (page < 1 || isNaN(page)) {
		const newSearchParams = new URLSearchParams(url.searchParams)
		newSearchParams.delete('page', '1')
		page = 1
	}
	const limit = parseInt(url.searchParams.get('limit') || '50')
	const skip = (page - 1) * limit

	// filters
	const search = url.searchParams.get('search') || ''

	const [result, errors] = await graphqlFetchAction({
		fetch,
		query: `
        query GET_CONVERSATION_CHATS($conversationID: String!, $skip: Int, $take: Int, $search: String) {
          getConversationChats(conversationID: $conversationID, skip: $skip, take: $take, search: $search)
        }
      `,
		variables: {
			conversationID,
			skip,
			take: limit,
			search
		}
	})

	if (errors) {
		return json({ errors })
	}

	return json({
		toUserID,
		chats: result.getConversationChats,
		conversationID
	})
}
