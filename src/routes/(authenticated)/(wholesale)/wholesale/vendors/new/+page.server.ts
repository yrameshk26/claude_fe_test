import type { Actions } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_VENDOR($name: String!) {
          createVendor(name: $name)
        }
      `,
			variables: {
				name: formData.get('name')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, `/wholesale/vendors/${result.createVendor}`)
	}
} satisfies Actions
