import { redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch, params, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'VIEW_PRODUCTS')
	) {
		redirect(307, '/unauthorized')
	}

	const { id } = params

	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
      query GET_ONE_PRODUCT($id: String!) {
        getOneProduct(id: $id)
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
		product: data.getOneProduct
	}
}
