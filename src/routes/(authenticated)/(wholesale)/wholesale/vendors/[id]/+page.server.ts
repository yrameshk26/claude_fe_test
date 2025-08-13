import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { vendor, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		vendor
	}
}

export const actions = {
	updateName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_VENDOR_NAME($id: String!, $name: String!) {
          updateVendorName(id: $id, name: $name)
        }
      `,
			variables: {
				id: params.id,
				name: formData.get('name')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateEmail: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_VENDOR_EMAIL($id: String!, $email: String) {
					updateVendorEmail(id: $id, email: $email)
				}
			`,
			variables: {
				id: params.id,
				email: formData.get('email') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePhoneNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_VENDOR_PHONE_NO($id: String!, $phoneNo: String) {
					updateVendorPhoneNo(id: $id, phoneNo: $phoneNo)
				}
			`,
			variables: {
				id: params.id,
				phoneNo: formData.get('phoneNo') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateAddress: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_VENDOR_ADDRESS($id: String!, $address: String) {
					updateVendorAddress(id: $id, address: $address)
				}
			`,
			variables: {
				id: params.id,
				address: formData.get('address') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDetails: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_VENDOR_DETAILS($id: String!, $details: String) {
					updateVendorDetails(id: $id, details: $details)
				}
			`,
			variables: {
				id: params.id,
				details: formData.get('details') || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	delete: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_VENDOR($id: String!) {
          deleteVendor(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/wholesale/vendors')
	}
} satisfies Actions
