import { graphqlFetchAction } from '$lib/utils'

export async function load({ fetch, params }) {
	const { id } = params

	const [data, errors] = await graphqlFetchAction({
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
		ticket: data.getOneTicket
	}
}
