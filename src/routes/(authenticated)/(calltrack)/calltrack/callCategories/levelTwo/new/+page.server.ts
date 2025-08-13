import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_CALL_CATEGORY_LEVEL_TWO($name: String!, $details: String, $callCategoryLevelOneID: String!) {
          createCallCategoryLevelTwo(name: $name, details: $details, callCategoryLevelOneID: $callCategoryLevelOneID)
        }
      `,
			variables: {
				name: formData.get('name'),
				details: formData.get('details'),
				callCategoryLevelOneID: formData.get('callCategoryLevelOneID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createCallCategoryLevelTwo
	}
} satisfies Actions
