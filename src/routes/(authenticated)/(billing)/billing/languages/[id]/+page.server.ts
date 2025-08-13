import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	messageCustomers: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation SEND_BULK_MESSAGES_TO_LANGUAGE($languageID: String!
          $type: MessageType!
          $subject: String!
          $message: String!
          $includeInactive: Boolean) {
          sendBulkMessagesToLanguage(languageID: $languageID
            type: $type
            subject: $subject
            message: $message
            includeInactive: $includeInactive)
        }
      `,
			variables: {
				languageID: params.id,
				type: formData.get('type'),
				subject: formData.get('subject'),
				message: formData.get('message'),
				includeInactive: formData.get('includeInactive') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
