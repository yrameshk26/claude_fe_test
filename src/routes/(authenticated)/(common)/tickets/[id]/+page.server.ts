import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch, params, locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(({ permissionType }) => permissionType === 'VIEW_ALL_TICKETS')
	) {
		redirect(307, '/unauthorized')
	}

	const { id } = params

	const [date, errors] = await graphqlFetchAction({
		fetch,
		query: `
      query GET_ONE_TICKET($id: String!) {
        getOneTicket(id: $id)
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
		ticket: date.getOneTicket
	}
}

export const actions = {
	updateTicketSubject: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_TICKET_SUBJECT($id: String!, $subjectID: String!) {
					updateTicketSubject(id: $id, subjectID: $subjectID)
				}
			`,
			variables: {
				id: params.id,
				subjectID: formData.get('subjectID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTicketStatus: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TICKET_STATUS($id: String!, $status: TicketStatus!) {
          updateTicketStatus(id: $id, status: $status)
        }
      `,
			variables: {
				id: params.id,
				status: formData.get('status')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTicketExpiryDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TICKET_EXPIRY_DATE($id: String!, $expiresAt: Date!) {
          updateTicketExpiresAt(id: $id, expiresAt: $expiresAt)
        }
      `,
			variables: {
				id: params.id,
				expiresAt: formData.get('expiresAt')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateTicketAssignedTo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_TICKET_ASSIGNED_TO($id: String!, $assignedToUserID: String!) {
          updateTicketAssignedTo(id: $id, assignedToUserID: $assignedToUserID)
        }
      `,
			variables: {
				id: params.id,
				assignedToUserID: formData.get('assignedToUserID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteTicket: async ({ request, fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_TICKET($id: String!) {
          deleteTicket(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		const formData = await request.formData()
		return redirect(
			307,
			(formData.get('referrerURL') as string) || '/billing/myTickets/userTickets'
		)
	}
} satisfies Actions
