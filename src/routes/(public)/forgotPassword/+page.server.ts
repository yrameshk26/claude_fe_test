import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation FORGOT_PASSWORD($email: EmailAddress!, $fingerprint: String!) {
					forgotPassword(email: $email, fingerprint: $fingerprint)
				}
      `,
			variables: {
				email: formData.get('email'),
				fingerprint: cookies.get('TVUPWEB_FINGERPRINT') as string
			}
		})
		if (errors) {
			return fail(422, { errors })
		}

		return {
			message: 'Password reset link sent to your email.'
		}
	}
} satisfies Actions
