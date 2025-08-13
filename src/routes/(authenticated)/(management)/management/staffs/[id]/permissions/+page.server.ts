import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals, fetch, parent }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'EDIT_STAFF_PERMISSIONS'
		)
	) {
		return {
			errors: [
				'You are not authorized to view this section of the page. Please contact your administrator.'
			]
		}
	}

	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
				query GET_ALL_PERMISSION_TYPES {
					getAllPermissionTypes
				}
			`
	})

	if (errors) {
		return { errors }
	}

	const allPermissionTypes = Object.entries(data.getAllPermissionTypes.MODEL_PERMISSION_TYPES) as [
		string,
		{ display: string; permissions: Record<string, string[]> }
	][]

	const fieldEditPermissions = data.getAllPermissionTypes.FIELD_EDIT_PERMISSION_TYPES as {
		[key: string]: {
			display: string
			permissions: Record<string, string[]>
		}
	}

	const { user } = await parent()

	if (!user) {
		return { errors: ['User not found'] }
	}

	type Permission = {
		id: string
		storeID: string
		userID: string
		app: string
		permissionType: string
	}

	// group by app
	const permissions = user?.permissions?.reduce(
		(acc: Record<string, Permission[]>, permission: Permission) => {
			acc[permission.app] = acc[permission.app] || []
			acc[permission.app].push(permission)
			return acc
		},
		{}
	) as Record<string, Permission[]>

	return {
		user,
		allPermissionTypes,
		fieldEditPermissions,
		permissions
	}
}

export const actions = {
	toggleUserPermission: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation TOGGLE_USER_PERMISSION($userID: String!, $app: App!, $permissionType: String!) {
          toggleUserPermission(userID: $userID, app: $app, permissionType: $permissionType)
        }
      `,
			variables: {
				userID: params.id,
				app: formData.get('app'),
				permissionType: formData.get('permissionType')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	toggleUserPermissionGroup: async ({ request, fetch, params }) => {
		const formData = await request.formData()

		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation TOGGLE_USER_PERMISSION_GROUP($userID: String!, $app: App!, $action: Action, $model: String, $enable: Boolean!) {
					toggleUserPermissionGroup(userID: $userID, app: $app, action: $action, model: $model, enable: $enable)
				}
			`,
			variables: {
				userID: params.id,
				app: formData.get('app'),
				action: formData.get('action'),
				model: formData.get('model'),
				enable: formData.get('enable') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
