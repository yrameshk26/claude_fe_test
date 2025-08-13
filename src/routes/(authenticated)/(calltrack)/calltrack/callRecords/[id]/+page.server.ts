import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { callRecord, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		callRecord
	}
}

const durationToSeconds = (duration: string) => {
	const [hours, minutes, seconds] = duration.split(':').map(Number)
	return hours * 3600 + minutes * 60 + seconds
}

export const actions = {
	updateCallRecordCustomerPhoneNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_RECORD_CUSTOMER_PHONE_NUMBER($id: String!, $customerPhoneNo: String!) {
          updateCallRecordCustomerPhoneNo(id: $id, customerPhoneNo: $customerPhoneNo)
        }
      `,
			variables: {
				id: params.id,
				customerPhoneNo: formData.get('customerPhoneNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordIsNewCustomer: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
      mutation UPDATE_CALL_RECORD_IS_NEW_CUSTOMER($id: String!, $isNewCustomer: Boolean!) {
        updateCallRecordIsNewCustomer(id: $id, isNewCustomer: $isNewCustomer)
      }
    `,
			variables: {
				id: params.id,
				isNewCustomer: formData.get('isNewCustomer') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordStartTime: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		// const startTime = formData.get('startTime') // YYYY-MM-DD, HH:MM:SS
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_RECORD_START_TIME($id: String!, $startTime: DateTime!) {
          updateCallRecordStartTime(id: $id, startTime: $startTime)
        }
      `,
			variables: {
				id: params.id,
				startTime: new Date(formData.get('startTime') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordEndTime: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_RECORD_END_TIME($id: String!, $endTime: DateTime!) {
          updateCallRecordEndTime(id: $id, endTime: $endTime)
        }
      `,
			variables: {
				id: params.id,
				endTime: new Date(formData.get('endTime') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordCustomerWaitSeconds: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_RECORD_CUSTOMER_WAIT_MINUTES($id: String!, $customerWaitSeconds: Int!) {
					updateCallRecordCustomerWaitSeconds(id: $id, customerWaitSeconds: $customerWaitSeconds)
				}
			`,
			variables: {
				id: params.id,
				customerWaitSeconds: durationToSeconds(formData.get('customerWaitSeconds') as string) || 0
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},

	updateCallRecordStorePhoneNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_RECORD_STORE_PHONE_NUMBER($id: String!, $storePhoneNumberID: String!) {
          updateCallRecordStorePhoneNumberID(id: $id, storePhoneNumberID: $storePhoneNumberID)
        }
      `,
			variables: {
				id: params.id,
				storePhoneNumberID: formData.get('storePhoneNumberID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordCallType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_RECORD_CALL_TYPE($id: String!, $callType: CallType) {
					updateCallRecordCallType(id: $id, callType: $callType)
			}
			`,
			variables: {
				id: params.id,
				callType: formData.get('callType') ? formData.get('callType') : null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordCallCategory: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_RECORD_CALL_CATEGORY($id: String!, $callCategoryLevelOneID: String, $callCategoryLevelTwoID: String, $callCategoryLevelThreeID: String) {
					updateCallRecordCallCategory(id: $id, callCategoryLevelOneID: $callCategoryLevelOneID, callCategoryLevelTwoID: $callCategoryLevelTwoID, callCategoryLevelThreeID: $callCategoryLevelThreeID)
				}
			`,
			variables: {
				id: params.id,
				callCategoryLevelOneID: formData.get('callCategoryLevelOneID'),
				callCategoryLevelTwoID: formData.get('callCategoryLevelTwoID'),
				callCategoryLevelThreeID: formData.get('callCategoryLevelThreeID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordServiceType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_RECORD_SERVICE_TYPE($id: String!, $serviceTypeID: String!) {
          updateCallRecordServiceTypeID(id: $id, serviceTypeID: $serviceTypeID)
        }
      `,
			variables: {
				id: params.id,
				serviceTypeID: formData.get('serviceTypeID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordProductType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CALL_RECORD_PRODUCT_TYPE($id: String!, $productTypeID: String!) {
          updateCallRecordProductTypeID(id: $id, productTypeID: $productTypeID)
        }
      `,
			variables: {
				id: params.id,
				productTypeID: formData.get('productTypeID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCallRecordMacID: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CALL_RECORD_MAC_ID($id: String!, $macID: String!) {
					updateCallRecordMacID(id: $id, macID: $macID)
				}
			`,
			variables: {
				id: params.id,
				macID: formData.get('macID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteCallRecord: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_CALL_RECORD($id: String!) {
          deleteCallRecord(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/calltrack/callRecords')
	}
} satisfies Actions
