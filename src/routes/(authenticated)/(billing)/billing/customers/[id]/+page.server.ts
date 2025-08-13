import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { customer, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		customer
	}
}

export const actions = {
	updateCustomerFullName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_FULL_NAME($id: String!, $fullName: String!) {
          updateCustomerFullName(id: $id, fullName: $fullName)
        }
      `,
			variables: {
				id: params.id,
				fullName: formData.get('fullName')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerEmail: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_EMAIL($id: String!, $email: String) {
          updateCustomerEmail(id: $id, email: $email)
        }
      `,
			variables: {
				id: params.id,
				email: formData.get('email')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerJoinedDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_JOINED_DATE($id: String!, $joinedDate: Date!) {
          updateCustomerJoinedDate(id: $id, joinedDate: $joinedDate)
        }
      `,
			variables: {
				id: params.id,
				joinedDate: formData.get('joinedDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerPin: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_PIN($id: String!, $pin: Int!) {
          updateCustomerPin(id: $id, pin: $pin)
        }
      `,
			variables: {
				id: params.id,
				pin: parseInt(formData.get('pin') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerSource: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_SOURCE($id: String!, $sourceID: String!) {
          updateCustomerSource(id: $id, sourceID: $sourceID)
        }
      `,
			variables: {
				id: params.id,
				sourceID: formData.get('sourceID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerLanguage: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_LANGUAGE($id: String!, $languageID: String!) {
          updateCustomerLanguage(id: $id, languageID: $languageID)
        }
      `,
			variables: {
				id: params.id,
				languageID: formData.get('languageID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerIsFromCall: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_IS_FROM_CALL($id: String!, $isFromCall: Boolean!) {
					updateCustomerIsFromCall(id: $id, isFromCall: $isFromCall)
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
	removeCustomerIsTrial: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation REMOVE_CUSTOMER_IS_TRIAL($id: String!) {
					removeCustomerIsTrial(id: $id)
				}
			`,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerAddress: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_ADDRESS($id: String!, $streetNumber: String!, $streetName: String!, $city: String!, $province: String!, $country: String!, $postalCode: String!) {
					updateCustomerAddress(id: $id, streetNumber: $streetNumber, streetName: $streetName, city: $city, province: $province, country: $country, postalCode: $postalCode)
				}
			`,
			variables: {
				id: params.id,
				streetNumber: formData.get('streetNumber'),
				streetName: formData.get('streetName'),
				city: formData.get('city'),
				province: formData.get('province'),
				country: formData.get('country'),
				postalCode: formData.get('postalCode')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerStreetNumber: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_STREET_NUMBER($id: String!, $streetNumber: String!) {
					updateCustomerStreetNumber(id: $id, streetNumber: $streetNumber)
				}
			`,
			variables: {
				id: params.id,
				streetNumber: formData.get('streetNumber')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerStreetName: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_STREET_NAME($id: String!, $streetName: String!) {
					updateCustomerStreetName(id: $id, streetName: $streetName)
				}
			`,
			variables: {
				id: params.id,
				streetName: formData.get('streetName')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerCity: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_CITY($id: String!, $city: String!) {
					updateCustomerCity(id: $id, city: $city)
				}
			`,
			variables: {
				id: params.id,
				city: formData.get('city')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerCountry: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_COUNTRY($id: String!, $country: String!) {
					updateCustomerCountry(id: $id, country: $country)
				}
			`,
			variables: {
				id: params.id,
				country: formData.get('country')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerProvince: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_PROVINCE($id: String!, $province: String!) {
					updateCustomerProvince(id: $id, province: $province)
				}
			`,
			variables: {
				id: params.id,
				province: formData.get('province')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerPostalCode: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_POSTAL_CODE($id: String!, $postalCode: String!) {
          updateCustomerPostalCode(id: $id, postalCode: $postalCode)
        }
      `,
			variables: {
				id: params.id,
				postalCode: (formData.get('postalCode') as string).toUpperCase()
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerSendReminderByEmail: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		let sendReminderBy = JSON.parse(formData.get('sendReminderBy') as string) as string[]
		if (formData.get('sendReminderByEmail') === 'on') {
			if (!sendReminderBy.includes('EMAIL')) {
				sendReminderBy = [...sendReminderBy, 'EMAIL']
			}
		} else {
			sendReminderBy = sendReminderBy.filter((item) => item !== 'EMAIL')
		}
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_REMINDER_EMAIL($id: String!, $sendReminderBy: [MessageType!]) {
          updateCustomerSendReminderBy(id: $id, sendReminderBy: $sendReminderBy)
        }
      `,
			variables: {
				id: params.id,
				sendReminderBy
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerSendReminderBySMS: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		let sendReminderBy = JSON.parse(formData.get('sendReminderBy') as string) as string[]
		if (formData.get('sendReminderBySMS') === 'on') {
			if (!sendReminderBy.includes('SMS')) {
				sendReminderBy = [...sendReminderBy, 'SMS']
			}
		} else {
			sendReminderBy = sendReminderBy.filter((item) => item !== 'SMS')
		}
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_REMINDER_SMS($id: String!, $sendReminderBy: [MessageType!]) {
          updateCustomerSendReminderBy(id: $id, sendReminderBy: $sendReminderBy)
        }
      `,
			variables: {
				id: params.id,
				sendReminderBy
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerSendReminderByWhatsapp: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		let sendReminderBy = JSON.parse(formData.get('sendReminderBy') as string) as string[]
		if (formData.get('sendReminderByWhatsapp') === 'on') {
			if (!sendReminderBy.includes('WHATSAPP')) {
				sendReminderBy = [...sendReminderBy, 'WHATSAPP']
			}
		} else {
			sendReminderBy = sendReminderBy.filter((item) => item !== 'WHATSAPP')
		}
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_CUSTOMER_REMINDER_WHATSAPP($id: String!, $sendReminderBy: [MessageType!]) {
          updateCustomerSendReminderBy(id: $id, sendReminderBy: $sendReminderBy)
        }
      `,
			variables: {
				id: params.id,
				sendReminderBy
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateCustomerSkipPromotion: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_CUSTOMER_SKIP_PROMOTION($id: String!, $skipPromotion: Boolean!) {
					updateCustomerSkipPromotion(id: $id, skipPromotion: $skipPromotion)
				}
			`,
			variables: {
				id: params.id,
				skipPromotion: formData.get('skipPromotion') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	sendCustomerMessage: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation SEND_CUSTOMER_MESSAGE($customerID: String!, $type: MessageType!
          $subject: String!
          $message: String!) {
          sendMessageToCustomer(customerID: $customerID, type: $type, subject: $subject, message: $message)
        }
      `,
			variables: {
				customerID: params.id,
				type: formData.get('type'),
				subject: formData.get('subject'),
				message: formData.get('message')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deleteCustomer: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_CUSTOMER($id: String!) {
          deleteCustomer(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/billing/customers')
	}
} satisfies Actions
