import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const mutationName = formData.get('mutationName')
		const mutation = formData.get('mutation')
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ${mutationName}($id: String!, $name: String!) {
          ${mutation}(id: $id, name: $name)
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
	updateDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const mutationName = formData.get('mutationName')
		const mutation = formData.get('mutation')
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ${mutationName}($id: String!, $details: String!) {
          ${mutation}(id: $id, details: $details)
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
	delete: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const mutationName = formData.get('mutationName')
		const mutation = formData.get('mutation')
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ${mutationName}($id: String!) {
          ${mutation}(id: $id)
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
