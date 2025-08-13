import type { Actions } from './$types'

import { redirect, fail } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export async function load({ locals }) {
	if (
		!locals.session.isAdmin &&
		!locals.session.permissions.find(
			({ permissionType }) => permissionType === 'ADD_DAILY_REPORT_LOG'
		)
	) {
		redirect(307, '/unauthorized')
	}
}

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData()

		type PaymentPayload = {
			paymentMethod: { id: string; name: string; isCard: boolean }
			terminalID: string
			authorizationCode: string
			details: string
			amount: string
		}
		const paymentsPayload: PaymentPayload[] = JSON.parse(formData.get('payments') as string) || []
		// convert all paymentPayload to paymentInput
		const payments = paymentsPayload.map(
			({ paymentMethod, terminalID, authorizationCode, details, amount }) => {
				return {
					paymentMethodID: paymentMethod.id,
					terminalID: terminalID || null,
					authorizationCode,
					details,
					amount: parseFloat(amount)
				}
			}
		)

		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_DAILY_REPORT_LOG($data: CreateDailyReportLogInput!) {
          createDailyReportLog(data: $data)
        }
      `,
			variables: {
				data: {
					processedDate: formData.get('processedDate'),
					salesPersonID: formData.get('salesPersonID'),
					transactionType: formData.get('transactionType'),
					transactionNo: formData.get('transactionNo'),
					refundReceiptNo: formData.get('refundReceiptNo'),
					receivingPaymentNo: formData.get('receivingPaymentNo'),
					companyID: formData.get('companyID'),
					notes: formData.get('notes'),
					needVerification: formData.get('needVerification') === 'on',
					payments
				}
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return result.createDailyReportLog
	}
} satisfies Actions
