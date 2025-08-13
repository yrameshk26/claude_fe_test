import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	denyLoginApproval: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DENY_LOGIN_APPROVAL($id: String!) {
          denyLoginApproval(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},

	approveLoginApproval: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation APPROVE_LOGIN_APPROVAL($id: String!) {
          approveLoginApproval(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateLoginApprovalExpiryDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_LOGIN_APPROVAL_DATE($id: String!, $expiresAt: Date!) {
          extendLoginApproval(id: $id, expiresAt: $expiresAt)
        }
      `,
			variables: {
				id: params.id,
				expiresAt: formData.get('expiresAt')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteLoginApproval: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_LOGIN_APPROVAL($id: String!) {
          deleteLoginApproval(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/management/loginApprovals')
	}
} satisfies Actions
