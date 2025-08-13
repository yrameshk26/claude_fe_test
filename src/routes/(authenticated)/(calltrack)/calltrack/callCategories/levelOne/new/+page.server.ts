import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_CALL_CATEGORY_LEVEL_ONE($name: String!, $details: String) {
          createCallCategoryLevelOne(name: $name, details: $details)
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
		return result.createCallCategoryLevelOne
	}
} satisfies Actions
