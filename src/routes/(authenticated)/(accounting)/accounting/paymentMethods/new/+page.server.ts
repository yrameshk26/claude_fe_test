import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_PAYMENT_METHOD($name: String!, $details: String, $isCard: Boolean!) {
          createPaymentMethod(name: $name, details: $details, isCard: $isCard)
        }
      `,
			variables: {
				name: formData.get('name'),
				details: formData.get('details'),
				isCard: formData.get('isCard') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createPaymentMethod
	}
} satisfies Actions
