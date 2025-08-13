import type { Actions } from './$types'

import { redirect, fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'ADD_STAFF')
	) {
		redirect(307, '/unauthorized')
	}
}

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_USER($data: CreateUserInput!) {
          createUser(data: $data)
        }
      `,
			variables: {
				data: {
					email: (formData.get('email') as string).toLowerCase(),
					fullName: formData.get('fullName'),
					primaryPhoneNumber: `${formData.get('countryCode')}${formData.get('primaryPhoneNumber')}`,
					password: formData.get('password'),
					isAdmin: formData.get('isAdmin') === 'on'
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createUser
	}
} satisfies Actions
