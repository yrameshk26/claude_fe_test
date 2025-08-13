import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_STORE_PHONE_NUMBER($name: String!, $details: String, $phoneNo: String!) {
          createStorePhoneNumber(name: $name, details: $details, phoneNo: $phoneNo)
        }
      `,
			variables: {
				name: formData.get('name'),
				details: formData.get('details'),
				phoneNo: formData.get('phoneNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createStorePhoneNumber
	}
} satisfies Actions
