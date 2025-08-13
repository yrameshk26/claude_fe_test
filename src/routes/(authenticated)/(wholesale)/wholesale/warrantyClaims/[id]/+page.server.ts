import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { warrantyClaim, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		warrantyClaim
	}
}

export const actions = {
	updateWarrantyClaimProduct: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_WARRANTY_CLAIM_PRODUCT($id: String!, $productID: String!) {
          updateWarrantyClaimProductID(id: $id, productID: $productID)
        }
      `,
			variables: {
				id: params.id,
				productID: formData.get('productID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateWarrantyClaimReturnedDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_WARRANTY_CLAIM_RETURNED_DATE($id: String!, $returnedDate: Date!) {
          updateWarrantyClaimReturnedDate(id: $id, returnedDate: $returnedDate)
        }
      `,
			variables: {
				id: params.id,
				returnedDate: formData.get('returnedDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateWarrantyClaimStatus: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_WARRANTY_CLAIM_STATUS($id: String!, $status: WarrantyClaimStatus!) {
					updateWarrantyClaimStatus(id: $id, status: $status)
				}
			`,
			variables: {
				id: params.id,
				status: formData.get('status')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteWarrantyClaim: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_WARRANTY_CLAIM($id: String!) {
          deleteWarrantyClaim(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/wholesale/warrantyClaims')
	}
} satisfies Actions
