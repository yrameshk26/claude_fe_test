import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateCallCategoryLevelTwoName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_CATEGORY_LEVEL_TWO_NAME($id: String!, $name: String!) {
          updateCallCategoryLevelTwoName(id: $id, name: $name)
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
	updateCallCategoryLevelTwoDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_CATEGORY_LEVEL_TWO_DETAILS($id: String!, $details: String) {
					updateCallCategoryLevelTwoDetails(id: $id, details: $details)
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
	updateCallCategoryLevelTwoCallCategoryLevelOne: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_CATEGORY_LEVEL_TWO_CALL_CATEGORY_LEVEL_ONE($id: String!, $callCategoryLevelOneID: String!) {
					updateCallCategoryLevelTwoCallCategoryLevelOneID(id: $id, callCategoryLevelOneID: $callCategoryLevelOneID)
				}
			`,
			variables: {
				id: params.id,
				callCategoryLevelOneID: formData.get('callCategoryLevelOneID')
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
        mutation DELETE_CALL_CATEGORY_LEVEL_TWO($id: String!) {
          deleteCallCategoryLevelTwo(id: $id)
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
