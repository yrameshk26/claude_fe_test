import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_SERVICE_TYPE($name: String!, $details: String, $topupDueDays: Int!, $reminderDays: Int!, $color: String!) {
          createServiceType(name: $name, details: $details, topupDueDays: $topupDueDays, reminderDays: $reminderDays, color: $color)
        }
      `,
			variables: {
				name: formData.get('name'),
				details: formData.get('details'),
				topupDueDays: parseInt(formData.get('topupDueDays') as string),
				reminderDays: parseInt(formData.get('reminderDays') as string),
				color: formData.get('color')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createServiceType
	}
} satisfies Actions
