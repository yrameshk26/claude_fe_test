import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_CALL_CATEGORY_LEVEL_THREE($name: String!, $details: String, $callCategoryLevelTwoID: String!) {
          createCallCategoryLevelThree(name: $name, details: $details, callCategoryLevelTwoID: $callCategoryLevelTwoID)
        }
      `,
			variables: {
				name: formData.get('name'),
				details: formData.get('details'),
				callCategoryLevelTwoID: formData.get('callCategoryLevelTwoID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createCallCategoryLevelThree
	}
} satisfies Actions
