import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch, locals }) {
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_USER_PREFERENCES($where: UserPreferenceWhereInput, $persistentWhere: UserPreferenceWhereInput, $orderBy: [UserPreferenceOrderByInput!]) {
				getUserPreferences(where: $where, persistentWhere: $persistentWhere, orderBy: $orderBy)
			}
		`,
		variables: {
			whereFilter: { group: { equals: 'REPORTS' } },
			persistentWhere: { id: { equals: locals.session.id } },
			orderBy: [{ createdAt: 'desc' }]
		}
	})

	if (errors) {
		return { errors }
	}

	return {
		reports: data.getUserPreferences.data
	}
}
