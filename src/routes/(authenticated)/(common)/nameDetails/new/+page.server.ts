import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()
		const mutationName = formData.get('mutationName')
		const mutation = formData.get('mutation') as string
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ${mutationName}($name: String!, $details: String) {
          ${mutation}(name: $name, details: $details)
        }
      `,
			variables: {
				name: formData.get('name'),
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result[mutation]
	}
} satisfies Actions
