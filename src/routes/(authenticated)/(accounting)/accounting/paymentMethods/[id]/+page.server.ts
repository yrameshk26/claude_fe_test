import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updatePaymentMethodName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PAYMENT_METHOD_NAME($id: String!, $name: String!) {
          updatePaymentMethodName(id: $id, name: $name)
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
	updatePaymentMethodDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_PAYMENT_METHOD_DETAILS($id: String!, $details: String) {
					updatePaymentMethodDetails(id: $id, details: $details)
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
	updatePaymentMethodIsCard: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PAYMENT_METHOD_IS_CARD($id: String!, $isCard: Boolean!) {
          updatePaymentMethodIsCard(id: $id, isCard: $isCard)
        }
      `,
			variables: {
				id: params.id,
				isCard: formData.get('isCard') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	delete: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_PAYMENT_METHOD($id: String!) {
          deletePaymentMethod(id: $id)
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
