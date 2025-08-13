import { redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch, params, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'VIEW_WARRANTY_CLAIMS'
		)
	) {
		redirect(307, '/unauthorized')
	}

	const { id } = params

	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
      query GET_ONE_WARRANTY_CLAIM($id: String!) {
        getOneWarrantyClaim(id: $id)
      }
    `,
		variables: {
			id
		}
	})

	if (errors) {
		return { errors }
	}

	return {
		warrantyClaim: data.getOneWarrantyClaim
	}
}
