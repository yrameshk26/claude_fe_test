import type { Actions } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import { dev } from '$app/environment'

export async function load({ fetch }) {
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_MY_PROFILE {
				getMyProfile
			}
		`
	})

	return {
		myProfile: data.getMyProfile,
		errors
	}
}

export const actions = {
	deleteMySession: async ({ fetch, request }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_MY_SESSION($id: String!) {
          deleteSession(id: $id)
        }
      `,
			variables: {
				id: formData.get('id')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteAllMySessions: async ({ fetch, locals, cookies }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation DELETE_ALL_MY_SESSIONS($id: String!) {
					deleteAllUserSessions(id: $id)
				}
			`,
			variables: {
				id: locals.session.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		// clear session cookie and logout
		cookies.set('TVUPWEB_AUTH_SESSION_ID', '', {
			expires: new Date(0),
			path: '/',
			secure: !dev
		})
		redirect(302, '/login')
	},
	refreshMySession: async ({ cookies, fetch }) => {
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation REFRESH_TOKEN {
					refreshToken
				}
			`
		})
		if (errors) {
			return fail(422, { errors })
		}
		cookies.set('TVUPWEB_AUTH_SESSION_ID', result.refreshToken, {
			path: '/',
			secure: !dev
		})
	},
	resetMyPassword: async ({ request, fetch }) => {
		const formData = await request.formData()
		// validation
		if (formData.get('password') !== formData.get('confirmPassword')) {
			return fail(422, { errors: [{ message: 'Passwords do not match' }] })
		}
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation RESET_MY_PASSWORD($id: String!, $password: String!) {
          updateUserPassword(id: $id, password: $password)
        }
      `,
			variables: {
				id: formData.get('id'),
				password: formData.get('password')
			}
		})
		if (errors) {
			return fail(422, { errors })
		} else {
			return redirect(307, '/login')
		}
	},
	updateMyFullName: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_MY_FULL_NAME($id: String!, $fullName: String!) {
          updateUserFullName(id: $id, fullName: $fullName)
        }
      `,
			variables: {
				id: formData.get('id'),
				fullName: formData.get('fullName')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateMyEmail: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_MY_EMAIL($id: String!, $email: String!) {
          updateUserEmail(id: $id, email: $email)
        }
      `,
			variables: {
				id: formData.get('id'),
				email: formData.get('email')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateMyProfileImage: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_MY_PROFILE_IMAGE($id: String!) {
          updateUserImage(id: $id)
        }
      `,
			variables: {
				id: formData.get('id')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.updateUserImage
	},
	deleteMyProfileImage: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation DELETE_MY_PROFILE_IMAGE($id: String!) {
					removeUserImage(id: $id)
				}
			`,
			variables: {
				id: formData.get('id')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateMyPhoneNumberType: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_MY_PHONE_NUMBER_TYPE($userID: String!, $id: String!, $type: PhoneNumberType!) {
          updateUserPhoneNumberType(userID: $userID, id: $id, type: $type)
        }
      `,
			variables: {
				userID: formData.get('userID'),
				id: formData.get('id'),
				type: formData.get('type')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateMyPhoneNumberValue: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_MY_PHONE_NUMBER_VALUE($userID: String!, $id: String!, $value: PhoneNumber!) {
          updateUserPhoneNumberValue(userID: $userID, id: $id, value: $value)
        }
      `,
			variables: {
				userID: formData.get('userID'),
				id: formData.get('id'),
				value: formData.get('value')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	setMyPrimaryPhoneNumber: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation SET_MY_PRIMARY_PHONE_NUMBER($userID: String!, $id: String!) {
          updateUserPrimaryPhoneNumber(userID: $userID, id: $id)
        }
      `,
			variables: {
				userID: formData.get('userID'),
				id: formData.get('id')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteMyPhoneNumber: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_MY_PHONE_NUMBER($userID: String!, $id: String!) {
          deleteUserPhoneNumber(userID: $userID, id: $id)
        }
      `,
			variables: {
				userID: formData.get('userID'),
				id: formData.get('id')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addMyPhoneNumber: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation ADD_MY_PHONE_NUMBER($userID: String!, $type: PhoneNumberType!, $value: PhoneNumber!) {
          addUserPhoneNumber(userID: $userID, type: $type, value: $value)
        }
      `,
			variables: {
				userID: formData.get('userID'),
				type: formData.get('type'),
				value: `${formData.get('countryCode')}${formData.get('value')}`
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
