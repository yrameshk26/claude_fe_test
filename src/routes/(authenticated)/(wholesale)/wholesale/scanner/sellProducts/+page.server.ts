import type { Actions } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType, app }) => permissionType === 'ADD_PRODUCTS' && app === 'WHOLESALE'
		)
	) {
		redirect(307, '/unauthorized')
	}
}

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors, detailedErrors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation SELL_PRODUCTS_TO_RESELLERS($data: BulkUpdateResellersInput!) {
          bulkUpdateResellers(data: $data)
        }
      `,
			variables: {
				data: {
					productIdentifiers: JSON.parse(formData.get('productIdentifiers') as string),
					resellerID: formData.get('resellerID'),
					resellerInvoiceNo: formData.get('resellerInvoiceNo'),
					resellerPurchaseDt: formData.get('resellerPurchaseDt'),
					resellerWarrantyExpiryDt: formData.get('resellerWarrantyExpiryDt'),
					notes: formData.get('notes')
				}
			}
		})

		if (errors) {
			return fail(422, { errors, detailedErrors })
		}

		return result.bulkUpdateResellers
	}
} satisfies Actions
