import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateServiceTypeUrlUrlName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_URL_NAME($id: String!, $urlName: String!) {
          updateServiceTypeUrlUrlName(id: $id, urlName: $urlName)
        }
      `,
			variables: {
				id: params.id,
				urlName: formData.get('urlName')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeUrlUrl: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_SERVICE_TYPE_URL_URL($id: String!, $url: String!) {
					updateServiceTypeUrlUrl(id: $id, url: $url)
				}
			`,
			variables: {
				id: params.id,
				url: formData.get('url')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeUrlServiceType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_SERVICE_TYPE_URL_SERVICE_TYPE_ID($id: String!, $serviceTypeID: String!) {
					updateServiceTypeUrlServiceTypeID(id: $id, serviceTypeID: $serviceTypeID)
				}
			`,
			variables: {
				id: params.id,
				serviceTypeID: formData.get('serviceTypeID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	messageCustomers: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation SEND_BULK_MESSAGES_TO_SERVICE_TYPE_URL($serviceTypeUrlID: String!
          $type: MessageType!
          $subject: String!
          $message: String!
          $includeInactive: Boolean) {
          sendBulkMessagesToServiceTypeUrl(serviceTypeUrlID: $serviceTypeUrlID
            type: $type
            subject: $subject
            message: $message
            includeInactive: $includeInactive)
        }
      `,
			variables: {
				serviceTypeUrlID: params.id,
				type: formData.get('type'),
				subject: formData.get('subject'),
				message: formData.get('message'),
				includeInactive: formData.get('includeInactive') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteServiceTypeUrl: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_SERVICE_TYPE_URL($id: String!) {
          deleteServiceTypeUrl(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
