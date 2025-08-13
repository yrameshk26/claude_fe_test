import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updatePhoneNumberType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PHONE_NUMBER_TYPE($id: String!, $type: PhoneNumberType!) {
          updatePhoneNumberType(id: $id, type: $type)
        }
      `,
			variables: {
				id: params.id,
				type: formData.get('type')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePhoneNumberValue: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PHONE_NUMBER_TYPE($id: String!, $value: PhoneNumber!) {
          updatePhoneNumberValue(id: $id, value: $value)
        }
      `,
			variables: {
				id: params.id,
				value: formData.get('value')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePrimaryPhoneNumber: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRIMARY_PHONE_NUMBER($id: String!) {
          updatePrimaryPhoneNumber(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deletePhoneNumber: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_PHONE_NUMBER($id: String!) {
          deletePhoneNumber(id: $id)
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
