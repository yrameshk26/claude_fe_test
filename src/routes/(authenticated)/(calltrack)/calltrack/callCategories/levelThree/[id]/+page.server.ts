import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateCallCategoryLevelThreeName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_CATEGORY_LEVEL_THREE_NAME($id: String!, $name: String!) {
          updateCallCategoryLevelThreeName(id: $id, name: $name)
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
	updateCallCategoryLevelThreeDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_CATEGORY_LEVEL_THREE_DETAILS($id: String!, $details: String) {
					updateCallCategoryLevelThreeDetails(id: $id, details: $details)
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
	updateCallCategoryLevelThreeCallCategoryLevelTwo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_CATEGORY_LEVEL_THREE_CALL_CATEGORY_LEVEL_ONE($id: String!, $callCategoryLevelTwoID: String!) {
					updateCallCategoryLevelThreeCallCategoryLevelTwo(id: $id, callCategoryLevelTwoID: $callCategoryLevelTwoID)
				}
			`,
			variables: {
				id: params.id,
				callCategoryLevelTwoID: formData.get('callCategoryLevelTwoID')
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
        mutation DELETE_CALL_CATEGORY_LEVEL_THREE($id: String!) {
          deleteCallCategoryLevelThree(id: $id)
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
