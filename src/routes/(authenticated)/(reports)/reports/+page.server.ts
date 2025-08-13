import { graphqlFetchAction } from '$lib/utils'
import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

export async function load({ fetch }) {
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query GET_DASHBOARD_COUNTS {
				getDashboardCounts
			}
		`
	})

	if (errors) {
		return { errors }
	}

	return {
		counts: data.getDashboardCounts
	}
}

export const actions = {
	saveToQuickReports: async ({ request, fetch }) => {
		const formData = await request.formData()
		const name = String(formData.get('name') || '')
			.trim()
			.toLowerCase()
			.replace(' ', '_')
		const valueURL = new URL(String(formData.get('value') || ''))
		// remove from and to dates
		valueURL.searchParams.delete('from')
		valueURL.searchParams.delete('to')
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation SAVE_TO_QUICK_REPORTS($key: String!, $value: JSON!, $group: String!) {
					upsertUserPreference(key: $key, value: $value, group: $group)
				}
			`,
			variables: {
				key: name,
				value: valueURL.toString(),
				group: 'REPORTS'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteQuickReport: async ({ request, fetch }) => {
		const formData = await request.formData()
		const id = String(formData.get('id') || '')
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation DELETE_QUICK_REPORT($id: String!) {
					deleteUserPreference(id: $id)
				}
			`,
			variables: {
				id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return {
			success: true
		}
	}
} satisfies Actions
