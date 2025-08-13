import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	updateNoteDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_NOTE_DETAILS($id: String!, $details: String!) {
          updateNoteDetails(id: $id, details: $details)
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
	deleteNote: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_NOTE($id: String!) {
          deleteNote(id: $id)
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
