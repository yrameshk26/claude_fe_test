import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateStorePhoneNumberName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_STORE_PHONE_NUMBER_NAME($id: String!, $name: String!) {
          updateStorePhoneNumberName(id: $id, name: $name)
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
	updateStorePhoneNumberDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_STORE_PHONE_NUMBER_DETAILS($id: String!, $details: String) {
					updateStorePhoneNumberDetails(id: $id, details: $details)
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
	updateStorePhoneNumberPhoneNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_STORE_PHONE_NUMBER_PHONE_NO($id: String!, $phoneNo: String!) {
          updateStorePhoneNumberPhoneNo(id: $id, phoneNo: $phoneNo)
        }
      `,
			variables: {
				id: params.id,
				phoneNo: formData.get('phoneNo')
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
        mutation DELETE_STORE_PHONE_NUMBER($id: String!) {
          deleteStorePhoneNumber(id: $id)
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
