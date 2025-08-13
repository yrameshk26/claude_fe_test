import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateCallCategoryLevelOneName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_CATEGORY_LEVEL_ONE_NAME($id: String!, $name: String!) {
          updateCallCategoryLevelOneName(id: $id, name: $name)
        }
      `,
			variables: {
				id: params.id,
				name: formData.get('name')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallCategoryLevelOneDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_CATEGORY_LEVEL_ONE_DETAILS($id: String!, $details: String) {
					updateCallCategoryLevelOneDetails(id: $id, details: $details)
				}
			`,
			variables: {
				id: params.id,
				details: formData.get('details')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	delete: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_CALL_CATEGORY_LEVEL_ONE($id: String!) {
          deleteCallCategoryLevelOne(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
