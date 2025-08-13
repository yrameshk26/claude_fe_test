import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { user, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		user
	}
}

export const actions = {
	updateUserFullName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_USER_FULL_NAME($id: String!, $fullName: String!) {
          updateUserFullName(id: $id, fullName: $fullName)
        }
      `,
			variables: {
				id: params.id,
				fullName: formData.get('fullName')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateUserEmail: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_USER_EMAIL($id: String!, $email: String!) {
          updateUserEmail(id: $id, email: $email)
        }
      `,
			variables: {
				id: params.id,
				email: formData.get('email')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateUserIsAdmin: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_USER_IS_ADMIN($id: String!, $isAdmin: Boolean!) {
          updateUserIsAdmin(id: $id, isAdmin: $isAdmin)
        }
      `,
			variables: {
				id: params.id,
				isAdmin: formData.get('isAdmin') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateUserProfileImage: async ({ fetch, params }) => {
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_USER_PROFILE_IMAGE($id: String!) {
          updateUserImage(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.updateUserImage
	},
	deleteUserProfileImage: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation DELETE_USER_PROFILE_IMAGE($id: String!) {
					removeUserImage(id: $id)
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
	resetUserPassword: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation RESET_USER_PASSWORD($id: String!, $password: String!) {
          updateUserPassword(id: $id, password: $password)
        }
      `,
			variables: {
				id: params.id,
				password: formData.get('password')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateUserIsLocked: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_USER_IS_LOCKED($id: String!, $isLocked: Boolean!) {
          updateUserIsLocked(id: $id, isLocked: $isLocked)
        }
      `,
			variables: {
				id: params.id,
				isLocked: formData.get('isLocked') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateUserRequiredOTP: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_USER_REQUIRED_OTP($id: String!, $requiredOTP: Boolean!) {
          updateUserRequiredOTP(id: $id, requiredOTP: $requiredOTP)
        }
      `,
			variables: {
				id: params.id,
				requiredOTP: formData.get('requiredOTP') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteUser: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_USER($id: String!) {
          deleteUser(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/management/staffs')
	}
} satisfies Actions
