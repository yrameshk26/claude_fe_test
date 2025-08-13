import type { Actions } from './$types'

import { fail, redirect } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_CALL_RECORD($storePhoneNumberID: String!) {
          createCallRecord(storePhoneNumberID: $storePhoneNumberID)
        }
      `,
			variables: {
				storePhoneNumberID: formData.get('storePhoneNumberID')
			}
		})

		if (errors) {
			return fail(422, { errors })
		}

		return redirect(307, `/calltrack/callRecords/${result.createCallRecord}`)
	}
} satisfies Actions
