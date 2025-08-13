import type { Actions } from './$types'

import { fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_SERVICE_TYPE_URL($urlName: String!, $url: String!, $serviceTypeID: String!) {
          createServiceTypeUrl(urlName: $urlName, url: $url, serviceTypeID: $serviceTypeID)
        }
      `,
			variables: {
				urlName: formData.get('urlName'),
				url: formData.get('url'),
				serviceTypeID: formData.get('serviceTypeID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createServiceTypeUrl
	}
} satisfies Actions
