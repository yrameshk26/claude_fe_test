import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

import loadTickets from '$lib/server/loadTickets'

export async function load({ fetch, locals, url }) {
	return loadTickets({
		fetch,
		url,
		locals
	})
}

export const actions = {
	createTicket: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_TICKET($data: CreateTicketInput!) {
          createTicket(data: $data)
        }
      `,
			variables: {
				data: {
					subjectID: formData.get('subjectID'),
					assignedToUserID: formData.get('assignedToUserID'),
					customerID: formData.get('customerID'),
					dailyReportLogID: formData.get('dailyReportLogID'),
					details: formData.get('details'),
					expiresAt: formData.get('expiresAt')
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	}
} satisfies Actions
