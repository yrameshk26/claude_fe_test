import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { service, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		service
	}
}

export const actions = {
	updateServiceCreatedDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_CREATED_DATE($id: String!, $createdDate: Date!) {
          updateServiceCreatedDate(id: $id, createdDate: $createdDate)
        }
      `,
			variables: {
				id: params.id,
				createdDate: formData.get('createdDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceMacID: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_MAC_ID($id: String!, $macID: MAC) {
          updateServiceMacID(id: $id, macID: $macID)
        }
      `,
			variables: {
				id: params.id,
				macID: (formData.get('macID') as string)?.toUpperCase() || null
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceAccountNumber: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_ACCOUNT_NUMBER($id: String!, $accountNumber: String) {
          updateServiceAccountNumber(id: $id, accountNumber: $accountNumber)
        }
      `,
			variables: {
				id: params.id,
				accountNumber: formData.get('accountNumber')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceServiceType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_SERVICE_TYPE($id: String!, $serviceTypeID: String!) {
          updateServiceServiceType(id: $id, serviceTypeID: $serviceTypeID)
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
	updateServiceServiceTypeUrl: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_SERVICE_SERVICE_TYPE_URL($id: String!, $serviceTypeUrlID: String!) {
					updateServiceServiceTypeUrl(id: $id, serviceTypeUrlID: $serviceTypeUrlID)
				}
			`,
			variables: {
				id: params.id,
				serviceTypeUrlID: formData.get('serviceTypeUrlID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceProductType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_PRODUCT_TYPE($id: String!, $productTypeID: String!) {
          updateServiceProductType(id: $id, productTypeID: $productTypeID)
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
	updateServiceIsFromCall: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_SERVICE_IS_FROM_CALL($id: String!, $isFromCall: Boolean!) {
					updateServiceIsFromCall(id: $id, isFromCall: $isFromCall)
				}
			`,
			variables: {
				id: params.id,
				isFromCall: formData.get('isFromCall') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceExpiryDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_EXPIRY_DATE($id: String!, $expiryDate: Date!) {
          updateServiceExpiryDate(id: $id, expiryDate: $expiryDate)
        }
      `,
			variables: {
				id: params.id,
				expiryDate: formData.get('expiryDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceInactive: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_INACTIVE($id: String!, $inactive: Boolean!) {
          updateServiceInactive(id: $id, inactive: $inactive)
        }
      `,
			variables: {
				id: params.id,
				inactive: formData.get('inactive') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceIsMonthly: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_IS_MONTHLY($id: String!, $isMonthly: Boolean!) {
          updateServiceIsMonthly(id: $id, isMonthly: $isMonthly)
        }
      `,
			variables: {
				id: params.id,
				isMonthly: formData.get('isMonthly') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceIsTrial: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_SERVICE_IS_TRIAL($id: String!, $isTrial: Boolean!) {
					updateServiceIsTrial(id: $id, isTrial: $isTrial)
				}
			`,
			variables: {
				id: params.id,
				isTrial: formData.get('isTrial') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceIsSwitched: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_IS_SWITCHED($id: String!, $isSwitched: Boolean!) {
          updateServiceIsSwitched(id: $id, isSwitched: $isSwitched)
        }
      `,
			variables: {
				id: params.id,
				isSwitched: formData.get('isSwitched') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceOnHold: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_ON_HOLD($id: String!, $putOnHold: Boolean!) {
          updateServiceOnHold(id: $id, putOnHold: $putOnHold)
        }
      `,
			variables: {
				id: params.id,
				putOnHold: formData.get('putOnHold') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceOnHoldDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_ON_HOLD_DATE($id: String!, $putOnHold: Boolean!, $onHoldDate: Date!) {
          updateServiceOnHold(id: $id, putOnHold: $putOnHold, onHoldDate: $onHoldDate)
        }
      `,
			variables: {
				id: params.id,
				putOnHold: true,
				onHoldDate: formData.get('onHoldDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	topupService: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation TOPUP_SERVICE($id: String!, $expiryDate: Date) {
          topupService(id: $id, expiryDate: $expiryDate)
        }
      `,
			variables: {
				id: params.id,
				expiryDate: formData.get('expiryDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	removeServiceFromTrial: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation REMOVE_SERVICE_FROM_TRIAL($id: String!, $transaction: ServiceTransactionInput!) {
          incrementServiceCredits(id: $id, transaction: $transaction)
        }
      `,
			variables: {
				id: params.id,
				transaction: {
					transactionDate: formData.get('transactionDate'),
					handledByUserID: formData.get('handledByUserID'),
					transactionType: formData.get('transactionType'),
					transactionNumber: formData.get('transactionNumber'),
					credits: parseInt(formData.get('credits') as string),
					notes: formData.get('notes')
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	incrementServiceCredits: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation INCREMENT_SERVICE_CREDITS($id: String!, $transaction: IncrementServiceCreditsInput!) {
          incrementServiceCredits(id: $id, transaction: $transaction)
        }
      `,
			variables: {
				id: params.id,
				transaction: {
					transactionDate: formData.get('transactionDate'),
					handledByUserID: formData.get('handledByUserID'),
					transactionType: formData.get('transactionType'),
					transactionNumber: formData.get('transactionNumber'),
					credits: parseInt(formData.get('credits') as string),
					notes: formData.get('notes')
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	decrementServiceCredits: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DECREMENT_SERVICE_CREDITS($id: String!, $transaction: DecrementServiceCreditsInput!) {
          decrementServiceCredits(id: $id, transaction: $transaction)
        }
      `,
			variables: {
				id: params.id,
				transaction: {
					transactionDate: formData.get('transactionDate'),
					handledByUserID: formData.get('handledByUserID'),
					transactionType: formData.get('transactionType'),
					transactionNumber: formData.get('transactionNumber'),
					credits: parseInt(formData.get('credits') as string),
					notes: formData.get('notes')
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateServiceCustomer: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_SERVICE_CUSTOMER($id: String!, $customerID: String!) {
          updateServiceCustomer(id: $id, customerID: $customerID)
        }
      `,
			variables: {
				id: params.id,
				customerID: formData.get('customerID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteService: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_SERVICE($id: String!) {
          deleteService(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/billing/services')
	}
} satisfies Actions
