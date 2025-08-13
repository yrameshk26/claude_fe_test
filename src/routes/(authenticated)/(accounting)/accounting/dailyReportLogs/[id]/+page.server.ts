import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ parent }) {
	const { dailyReportLog, errors } = await parent()

	if (errors) {
		return { errors }
	}

	return {
		dailyReportLog
	}
}

export const actions = {
	updateDailyReportLogProcessedDate: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_PROCESSED_DATE($id: String!, $processedDate: Date!) {
          updateDailyReportLogProcessedDate(id: $id, processedDate: $processedDate)
        }
      `,
			variables: {
				id: params.id,
				processedDate: formData.get('processedDate')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogSalesPerson: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_SALES_PERSON($id: String!, $salesPersonID: String!) {
          updateDailyReportLogSalesPerson(id: $id, salesPersonID: $salesPersonID)
        }
      `,
			variables: {
				id: params.id,
				salesPersonID: formData.get('salesPersonID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogCompany: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_COMPANY($id: String!, $companyID: String!) {
          updateDailyReportLogCompany(id: $id, companyID: $companyID)
        }
      `,
			variables: {
				id: params.id,
				companyID: formData.get('companyID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogTransactionNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_TRANSACTION_NO($id: String!, $transactionNo: String!) {
          updateDailyReportLogTransactionNo(id: $id, transactionNo: $transactionNo)
        }
      `,
			variables: {
				id: params.id,
				transactionNo: formData.get('transactionNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogTransactionType: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_TRANSACTION_TYPE($id: String!, $transactionType: String!) {
          updateDailyReportLogTransactionType(id: $id, transactionType: $transactionType)
        }
      `,
			variables: {
				id: params.id,
				transactionType: formData.get('transactionType')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogRefundReceiptNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_REFUND_RECEIPT_NO($id: String!, $refundReceiptNo: String!) {
          updateDailyReportLogRefundReceiptNo(id: $id, refundReceiptNo: $refundReceiptNo)
        }
      `,
			variables: {
				id: params.id,
				refundReceiptNo: formData.get('refundReceiptNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogReceivingPaymentNo: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_DAILY_REPORT_LOG_RECEIVING_PAYMENT_NO($id: String!, $receivingPaymentNo: String!) {
					updateDailyReportLogReceivingPaymentNo(id: $id, receivingPaymentNo: $receivingPaymentNo)
				}
			`,
			variables: {
				id: params.id,
				receivingPaymentNo: formData.get('receivingPaymentNo')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updateDailyReportLogNeedVerification: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_DAILY_REPORT_LOG_NEED_VERIFICATION($id: String!, $needVerification: Boolean!) {
          updateDailyReportLogNeedVerification(id: $id, needVerification: $needVerification)
        }
      `,
			variables: {
				id: params.id,
				needVerification: formData.get('needVerification') === 'on'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	addPayment: async ({ request, fetch, params }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation CREATE_PAYMENT($dailyReportLogID: String!, $paymentMethodID: String!, $terminalID: String, $authorizationCode: String, $details: String, $amount: Float!) {
          createPayment(dailyReportLogID: $dailyReportLogID, paymentMethodID: $paymentMethodID, terminalID: $terminalID, authorizationCode: $authorizationCode, details: $details, amount: $amount)
        }
      `,
			variables: {
				dailyReportLogID: params.id,
				paymentMethodID: formData.get('paymentMethodID'),
				terminalID: formData.get('terminalID'),
				authorizationCode: formData.get('authorizationCode'),
				details: formData.get('details'),
				amount: parseFloat(formData.get('amount') as string)
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePaymentMethod: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PAYMENT_PAYMENT_METHOD($id: String!,
          $paymentMethodID: String!) {
          updatePaymentPaymentMethod(id: $id,
            paymentMethodID: $paymentMethodID)
        }
      `,
			variables: {
				paymentMethodID: formData.get('paymentMethodID'),
				id: formData.get('paymentID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePaymentTerminal: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PAYMENT_TERMINAL($id: String!,
          $terminalID: String) {
          updatePaymentTerminal(id: $id,
            terminalID: $terminalID)
        }
      `,
			variables: {
				terminalID: formData.get('terminalID') || null,
				id: formData.get('paymentID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePaymentAuthorizationCode: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation UPDATE_PAYMENT_AUTHORIZATION_CODE($id: String!,
          $authorizationCode: String!) {
          updatePaymentAuthorizationCode(id: $id,
            authorizationCode: $authorizationCode)
        }
      `,
			variables: {
				authorizationCode: formData.get('authorizationCode'),
				id: formData.get('paymentID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePaymentDetails: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_PAYMENT_DETAILS($id: String!,
					$details: String!) {
					updatePaymentDetails(id: $id,
						details: $details)
				}
			`,
			variables: {
				details: formData.get('details'),
				id: formData.get('paymentID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	updatePaymentAmount: async ({ request, fetch }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation UPDATE_PAYMENT_AMOUNT($id: String!,
					$amount: Float!) {
					updatePaymentAmount(id: $id,
						amount: $amount)
				}
			`,
			variables: {
				amount: parseFloat(formData.get('amount') as string),
				id: formData.get('paymentID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	deletePayment: async ({ fetch, request }) => {
		const formData = await request.formData()
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_PAYMENT($id: String!) {
          deletePayment(id: $id)
        }
      `,
			variables: {
				id: formData.get('paymentID')
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
	},
	verifyDailyReportLog: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
				mutation VERIFY_DAILY_REPORT_LOG($id: String!) {
					verifyDailyReportLog(id: $id)
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
	deleteDailyReportLog: async ({ fetch, params }) => {
		const [, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation DELETE_DAILY_REPORT_LOG($id: String!) {
          deleteDailyReportLog(id: $id)
        }
      `,
			variables: {
				id: params.id
			}
		})
		if (errors) {
			return fail(422, { errors })
		}
		return redirect(307, '/accounting/dailyReportLogs')
	}
} satisfies Actions
