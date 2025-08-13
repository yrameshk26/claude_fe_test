import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { product, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		product
	}
}

export const actions = {
	updateProductSerialNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_SERIAL_NO($id: String!, $serialNo: String!) {
          updateProductSerialNo(id: $id, serialNo: $serialNo)
        }
      `,
			variables: {
				id: params.id,
				serialNo: formData.get('serialNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductMacID: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_MAC_ID($id: String!, $macID: String) {
          updateProductMacID(id: $id, macID: $macID)
        }
      `,
			variables: {
				id: params.id,
				macID: (formData.get('macID') as string)?.toUpperCase()
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductProductType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_PRODUCT_TYPE($id: String!, $productTypeID: String) {
          updateProductProductTypeID(id: $id, productTypeID: $productTypeID)
        }
      `,
			variables: {
				id: params.id,
				productTypeID: formData.get('productTypeID') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductVendor: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_VENDOR($id: String!, $vendorID: String!) {
          updateProductVendorID(id: $id, vendorID: $vendorID)
        }
      `,
			variables: {
				id: params.id,
				vendorID: formData.get('vendorID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductVendorInvoiceNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_VENDOR_INVOICE_NO($id: String!, $vendorInvoiceNo: String!) {
          updateProductVendorInvoiceNo(id: $id, vendorInvoiceNo: $vendorInvoiceNo)
        }
      `,
			variables: {
				id: params.id,
				vendorInvoiceNo: formData.get('vendorInvoiceNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductVendorPurchaseDt: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_VENDOR_PURCHASE_DATE($id: String!, $vendorPurchaseDt: Date!) {
          updateProductVendorPurchaseDt(id: $id, vendorPurchaseDt: $vendorPurchaseDt)
        }
      `,
			variables: {
				id: params.id,
				vendorPurchaseDt: formData.get('vendorPurchaseDt')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductVendorWarrantyExpiryDt: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_VENDOR_WARRANTY_EXPIRY_DATE($id: String!, $vendorWarrantyExpiryDt: Date!) {
          updateProductVendorWarrantyExpiryDt(id: $id, vendorWarrantyExpiryDt: $vendorWarrantyExpiryDt)
        }
      `,
			variables: {
				id: params.id,
				vendorWarrantyExpiryDt: formData.get('vendorWarrantyExpiryDt')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductReseller: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_RESELLER($id: String!, $resellerID: String) {
          updateProductResellerID(id: $id, resellerID: $resellerID)
        }
      `,
			variables: {
				id: params.id,
				resellerID: formData.get('resellerID') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductResellerInvoiceNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_RESELLER_INVOICE_NO($id: String!, $resellerInvoiceNo: String) {
          updateProductResellerInvoiceNo(id: $id, resellerInvoiceNo: $resellerInvoiceNo)
        }
      `,
			variables: {
				id: params.id,
				resellerInvoiceNo: formData.get('resellerInvoiceNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductResellerPurchaseDt: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_RESELLER_PURCHASE_DATE($id: String!, $resellerPurchaseDt: Date) {
          updateProductResellerPurchaseDt(id: $id, resellerPurchaseDt: $resellerPurchaseDt)
        }
      `,
			variables: {
				id: params.id,
				resellerPurchaseDt: formData.get('resellerPurchaseDt') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateProductResellerWarrantyExpiryDt: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PRODUCT_RESELLER_WARRANTY_EXPIRY_DATE($id: String!, $resellerWarrantyExpiryDt: Date) {
          updateProductResellerWarrantyExpiryDt(id: $id, resellerWarrantyExpiryDt: $resellerWarrantyExpiryDt)
        }
      `,
			variables: {
				id: params.id,
				resellerWarrantyExpiryDt: formData.get('resellerWarrantyExpiryDt') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteProduct: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_PRODUCT($id: String!) {
          deleteProduct(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/wholesale/products')
	}
} satisfies Actions
