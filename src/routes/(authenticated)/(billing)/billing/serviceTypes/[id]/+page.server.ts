import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateServiceTypeName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_NAME($id: String!, $name: String!) {
          updateServiceTypeName(id: $id, name: $name)
        }
      `,
			variables: {
				id: params.id,
				name: formData.get('name')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_DETAILS($id: String!, $details: String!) {
          updateServiceTypeDetails(id: $id, details: $details)
        }
      `,
			variables: {
				id: params.id,
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeTopupDueDays: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_TOPUP_DUE_DAYS($id: String!, $topupDueDays: Int!) {
          updateServiceTypeTopupDueDays(id: $id, topupDueDays: $topupDueDays)
        }
      `,
			variables: {
				id: params.id,
				topupDueDays: parseInt(formData.get('topupDueDays') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeReminderDays: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_REMINDER_DAYS($id: String!, $reminderDays: Int!) {
          updateServiceTypeReminderDays(id: $id, reminderDays: $reminderDays)
        }
      `,
			variables: {
				id: params.id,
				reminderDays: parseInt(formData.get('reminderDays') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeOrder: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_ORDER($id: String!, $order: Int!) {
          updateServiceTypeOrder(id: $id, order: $order)
        }
      `,
			variables: {
				id: params.id,
				order: parseInt(formData.get('order') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceTypeColor: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_TYPE_COLOR($id: String!, $color: String!) {
          updateServiceTypeColor(id: $id, color: $color)
        }
      `,
			variables: {
				id: params.id,
				color: formData.get('color')
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
        mutation SEND_BULK_MESSAGES_TO_SERVICE_TYPE($serviceTypeID: String!
          $type: MessageType!
          $subject: String!
          $message: String!
          $includeInactive: Boolean,
					$includeExpired: Boolean) {
          sendBulkMessagesToServiceType(serviceTypeID: $serviceTypeID
            type: $type
            subject: $subject
            message: $message
            includeInactive: $includeInactive
						includeExpired: $includeExpired)
        }
      `,
			variables: {
				serviceTypeID: params.id,
				type: formData.get('type'),
				subject: formData.get('subject'),
				message: formData.get('message'),
				includeInactive: formData.get('includeInactive') === 'on',
				includeExpired: formData.get('includeExpired') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteServiceType: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_SERVICE_TYPE($id: String!) {
          deleteServiceType(id: $id)
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
