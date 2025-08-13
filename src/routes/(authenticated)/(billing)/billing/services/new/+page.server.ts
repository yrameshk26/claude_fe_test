import type { Actions } from './$types'

import { redirect, fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'ADD_SERVICE')
	) {
		redirect(307, '/unauthorized')
	}
}

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_CUSTOMER_SERVICE($customerID: String!, $data: CreateServiceInput!) {
          createCustomerService(customerID: $customerID, data: $data)
        }
      `,
			variables: {
				customerID: formData.get('customerID'),
				data: {
					createdDate: formData.get('createdDate'),
					handledByUserID: formData.get('handledByUserID'),
					macID: (formData.get('macID') as string)?.toUpperCase(),
					accountNumber: formData.get('accountNumber'),
					serviceTypeID: formData.get('serviceTypeID'),
					serviceTypeUrlID: formData.get('serviceTypeUrlID'),
					productTypeID: formData.get('productTypeID'),
					transactionType: formData.get('transactionType'),
					transactionNumber: formData.get('transactionNumber'),
					credits: parseInt(formData.get('credits') as string),
					shipmentID: formData.get('shipmentID'),
					expiryDate: formData.get('expiryDate'),
					isMonthly: formData.get('isMonthly') === 'on',
					isSwitched: formData.get('isSwitched') === 'on',
					isTrial: formData.get('isTrial') === 'on',
					isFromCall: formData.get('isFromCall') === 'on',
					putOnHold: formData.get('putOnHold') === 'on',
					onHoldDate: formData.get('onHoldDate'),
					notes: formData.get('notes')
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		// auto topup if not on hold
		if (formData.get('putOnHold') !== 'on' && formData.get('isTrial') !== 'on') {
			const [, topupErrors] = await graphqlFetchAction({
				fetch,
				query: `
        mutation TOPUP_SERVICE($id: String!, $expiryDate: Date) {
          topupService(id: $id, expiryDate: $expiryDate)
        }
      `,
				variables: {
					id: result.createCustomerService,
					expiryDate: formData.get('expiryDate')
				}
			})
			if (topupErrors) {
				return fail(422, { errors: topupErrors })
			}
		}
		return result.createCustomerService
	}
} satisfies Actions
