import type { Actions } from './$types'

import { redirect, fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'ADD_PRODUCT')
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
        mutation CREATE_PRODUCT($data: CreateProductInput!) {
          createProduct(data: $data)
        }
      `,
			variables: {
				data: {
					serialNo: formData.get('serialNo'),
					macID: (formData.get('macID') as string)?.toUpperCase(),
					productTypeID: formData.get('productTypeID'),
					vendorID: formData.get('vendorID'),
					vendorInvoiceNo: formData.get('vendorInvoiceNo'),
					vendorPurchaseDt: formData.get('vendorPurchaseDt'),
					vendorWarrantyExpiryDt: formData.get('vendorWarrantyExpiryDt'),
					resellerID: formData.get('resellerID'),
					resellerInvoiceNo: formData.get('resellerInvoiceNo'),
					resellerPurchaseDt: formData.get('resellerPurchaseDt'),
					resellerWarrantyExpiryDt: formData.get('resellerWarrantyExpiryDt'),
					notes: formData.get('notes')
				}
			}
		})

		if (errors) {
			return fail(422, { errors })
		}

		return result.createProduct
	}
} satisfies Actions
