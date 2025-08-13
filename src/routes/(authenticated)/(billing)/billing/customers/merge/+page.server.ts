import type { Actions } from './$types'

import { redirect, fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'MERGE_CUSTOMERS')
	) {
		redirect(307, '/unauthorized')
	}
}

export const actions = {
	default: async ({ request, fetch, locals }) => {
		const formData = await request.formData()

		const customerIDs = (formData.get('customerIDs') as string).split(',')
		if (customerIDs.length < 2) {
			return fail(422, { errors: ['Select at least 2 customers to merge.'] })
		}

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation MERGE_CUSTOMERS($customerIDs: [String!]!, $data: CreateCustomerInput!) {
          mergeCustomers(customerIDs: $customerIDs, data: $data)
        }
      `,
			variables: {
				customerIDs,
				data: {
					joinedDate: formData.get('joinedDate'),
					storeID: locals.session.activeStoreId,
					handledByUserID: formData.get('handledByUserID'),
					fullName: formData.get('fullName'),
					primaryPhoneNumber: `${formData.get('countryCode')}${formData.get('primaryPhoneNumber')}`,
					email: (formData.get('email') as string)?.toLowerCase(),
					streetNumber: formData.get('streetNumber'),
					streetName: formData.get('streetName'),
					city: formData.get('city'),
					province: formData.get('province'),
					postalCode: (formData.get('postalCode') as string)?.toUpperCase(),
					country: formData.get('country'),
					sourceID: formData.get('sourceID'),
					languageID: formData.get('languageID'),
					pin: parseInt(formData.get('pin') as string),
					notes: formData.get('notes'),
					isFromCall: formData.get('isFromCall') === 'on'
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.mergeCustomers
	}
} satisfies Actions
