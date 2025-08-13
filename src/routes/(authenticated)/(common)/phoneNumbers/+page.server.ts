import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	addUserPhoneNumber: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ADD_USER_PHONE_NUMBER($userID: String!, $type: PhoneNumberType!, $value: PhoneNumber!, $isPrimary: Boolean!) {
          addPhoneNumber(userID: $userID, type: $type, value: $value, isPrimary: $isPrimary)
        }
      `,
			variables: {
				userID: formData.get('userID'),
				type: formData.get('type'),
				value: `${formData.get('countryCode')}${formData.get('value')}`,
				isPrimary: false
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addCustomerPhoneNumber: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ADD_CUSTOMER_PHONE_NUMBER($customerID: String!, $type: PhoneNumberType!, $value: PhoneNumber!, $isPrimary: Boolean!) {
          addPhoneNumber(customerID: $customerID, type: $type, value: $value, isPrimary: $isPrimary)
        }
      `,
			variables: {
				customerID: formData.get('customerID'),
				type: formData.get('type'),
				value: `${formData.get('countryCode')}${formData.get('value')}`,
				isPrimary: false
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
