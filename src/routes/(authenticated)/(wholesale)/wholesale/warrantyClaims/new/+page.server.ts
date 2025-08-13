import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_WARRANTY_CLAIM($data: CreateWarrantyClaimInput!) {
          createWarrantyClaim(data: $data)
        }
      `,
			variables: {
				data: {
					productID: formData.get('productID'),
					returnedDate: formData.get('returnedDate'),
					notes: formData.get('notes')
				}
			}
		})

		if (errors) {
			return fail(422, { errors })
		}

		return result.createWarrantyClaim
	}
} satisfies Actions
