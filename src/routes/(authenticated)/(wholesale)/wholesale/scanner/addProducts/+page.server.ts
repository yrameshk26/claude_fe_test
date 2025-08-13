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
        mutation CREATE_PRODUCTS($data: CreateProductsInput!) {
          createProducts(data: $data)
        }
      `,
			variables: {
				data: {
					productIdentifiers: JSON.parse(formData.get('productIdentifiers') as string),
					productTypeID: formData.get('productTypeID') || null,
					vendorID: formData.get('vendorID'),
					vendorInvoiceNo: formData.get('vendorInvoiceNo'),
					vendorPurchaseDt: formData.get('vendorPurchaseDt'),
					vendorWarrantyExpiryDt: formData.get('vendorWarrantyExpiryDt'),
					resellerID: formData.get('resellerID') || null,
					resellerInvoiceNo: formData.get('resellerInvoiceNo'),
					resellerPurchaseDt: formData.get('resellerPurchaseDt') || null,
					resellerWarrantyExpiryDt: formData.get('resellerWarrantyExpiryDt') || null,
					notes: formData.get('notes')
				}
			}
		})

		if (errors) {
			return fail(422, { errors, detailedErrors })
		}

		return result.createProducts
	}
} satisfies Actions
