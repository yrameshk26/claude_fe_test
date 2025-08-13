import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation RESET_PASSWORD($id: String!, $hash: String!, $newPassword: String!, $fingerprint: String!) {
					resetPassword(id: $id, hash: $hash, newPassword: $newPassword, fingerprint: $fingerprint)
				}
      `,
			variables: {
				id: formData.get('id'),
				hash: formData.get('hash'),
				newPassword: formData.get('newPassword'),
				fingerprint: cookies.get('TVUPWEB_FINGERPRINT') as string
			}
		})
		if (errors) {
			return fail(422, { errors })
		}

		return {
			message: 'Password reset successfully.'
		}
	}
} satisfies Actions
