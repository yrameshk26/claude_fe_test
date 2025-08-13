import { json } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'
import * as Sentry from '@sentry/sveltekit'

import type { RequestHandler } from './$types'

type SearchQueryType = { operator: string; relation: string; term: string; value: string }

const modelNamesToIdentifierField = {
	Customer: (customer: any) => customer.fullName,
	Language: (language: any) => language.name,
	Service: (service: any) => service.macID || service.accountNumber,
	ServiceType: (serviceType: any) => serviceType.name,
	ServiceTypeUrl: (serviceTypeUrl: any) => serviceTypeUrl.urlName,
	Shipment: (shipment: any) => shipment.name,
	Source: (source: any) => source.name,
	Transaction: (transaction: any) => transaction.transactionNumber,
	LoginApproval: (loginApproval: any) => loginApproval.fingerprint,
	Permission: (permission: any) => permission.permissionType,
	User: (user: any) => user.fullName,
	Session: (session: any) => session.fingerprint,
	ProductType: (productType: any) => productType.name,
	TicketSubject: (ticketSubject: any) => ticketSubject.name,
	Company: (company: any) => company.name,
	DailyReportLog: (dailyReportLog: any) =>
		dailyReportLog.transactionNo ||
		dailyReportLog.refundReceiptNo ||
		dailyReportLog.receivingPaymentNo,
	PaymentMethod: (paymentMethod: any) => paymentMethod.name,
	Terminal: (terminal: any) => terminal.name,
	Product: (product: any) => product.serialNo,
	Vendor: (vendor: any) => vendor.name,
	Reseller: (reseller: any) => reseller.name,
	CallCategoryLevelOne: (callCategoryLevelOne: any) => callCategoryLevelOne.name,
	CallCategoryLevelTwo: (callCategoryLevelTwo: any) => callCategoryLevelTwo.name,
	CallCategoryLevelThree: (callCategoryLevelThree: any) => callCategoryLevelThree.name,
	StorePhoneNumber: (storePhoneNumber: any) => storePhoneNumber.name
}

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { searchQueries, basePath }: { searchQueries: SearchQueryType[]; basePath: string } =
		await request.json()
	try {
		const getIdentifierLabel = async (searchQuery: SearchQueryType) => {
			try {
				const { operator, relation, term, value } = searchQuery

				if (operator !== 'equals' || !term || !value) {
					return searchQuery
				}

				let modelName = ''
				if (relation?.includes('ID')) {
					// extract the model name from the relation before the ID and make it title case
					modelName = relation.split('ID')[0]
				} else if (relation === 'id') {
					if (term.includes('User')) {
						modelName = 'User'
					} else {
						modelName = term
					}
				} else if (term === 'id') {
					modelName = basePath.split('/').pop()?.slice(0, -1) || ''
				}
				// convert modelName to title case
				modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1)

				if (!modelName) {
					return searchQuery
				}

				const [data, errors] = await graphqlFetchAction({
					fetch,
					query: `
				query GET_ONE_${modelName.toUpperCase()}($id: String!) {
					getOne${modelName}(id: $id)
				}
			`,
					variables: {
						id: value
					}
				})

				if (errors || !data || !data[`getOne${modelName}`]) {
					return searchQuery
				}

				const identifierFn =
					modelNamesToIdentifierField[modelName as keyof typeof modelNamesToIdentifierField]

				if (identifierFn) {
					const identifier = identifierFn(data[`getOne${modelName}`])
					return {
						...searchQuery,
						valueLabel: identifier
					}
				} else {
					return searchQuery
				}
			} catch (error) {
				console.error(error)
				return searchQuery
			}
		}

		const transformedSearchQueries = await Promise.all(searchQueries.map(getIdentifierLabel))

		return json(transformedSearchQueries)
	} catch (error) {
		console.error(error)
		Sentry.captureException(error)
		return json(searchQueries)
	}
}
