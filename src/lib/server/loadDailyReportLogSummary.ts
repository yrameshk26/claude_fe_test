import { redirect } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import { graphqlFetchAction } from '$lib/utils'

export default async function load({
	fetch: fetchFunction,
	queryName,
	query,
	url
}: {
	fetch: typeof fetch
	queryName: string
	query: string
	url: URL
}) {
	try {
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const fromDate = url.searchParams.get('fromDate') || today.toLocaleDateString('en-CA')
		const toDate = url.searchParams.get('toDate') || fromDate

		const [result, errors] = (await graphqlFetchAction({
			fetch: fetchFunction,
			query: `
          query ${queryName}($fromDate: Date!, $toDate: Date!) {
            ${query}(fromDate: $fromDate, toDate: $toDate)
          }
        `,
			variables: {
				fromDate,
				toDate
			}
		})) as [
			Record<
				typeof query,
				{
					company: {
						id: string
						name: string
					}
					children: {
						paymentMethod: {
							id: string
							name: string
						}
						amount: number
					}[]
					total: number
				}[]
			>,
			string[]
		]

		if (errors) {
			return { errors }
		}

		// Extract the company headers
		const headers = result[query].map(({ company }) => ({
			id: company.id,
			name: company.name
		}))

		// Build a map of payment methods to rows
		const paymentMethodsMap: Map<
			string,
			{
				paymentMethod: { id: string; name: string }
				amounts: { companyId: string; amount: number }[]
			}
		> = new Map()

		result[query].forEach(({ company, children }) => {
			children.forEach(({ paymentMethod, amount }) => {
				if (!paymentMethodsMap.has(paymentMethod.id)) {
					paymentMethodsMap.set(paymentMethod.id, { paymentMethod, amounts: [] })
				}
				paymentMethodsMap.get(paymentMethod.id)?.amounts.push({ companyId: company.id, amount })
			})
		})

		// Create rows with each row having payment method name followed by amounts for each company
		const rows = Array.from(paymentMethodsMap.values()).map(({ paymentMethod, amounts }) => {
			const row = [] as any[]
			row.push({ id: paymentMethod.id, name: paymentMethod.name }) // First column will be the payment method name and id
			headers.forEach((header) => {
				const amount = amounts.find(({ companyId }) => companyId === header.id)?.amount ?? 0
				row.push(Number(amount).toFixed(2)) // Ensure amount is a number and use .toFixed()
			})
			return row
		})

		// Add total column
		const totalColumn = [] as string[]
		headers.forEach((header) => {
			const total = result[query].find(({ company }) => company.id === header.id)?.total ?? 0
			totalColumn.push(Number(total).toFixed(2))
		})
		rows.push(['', ...totalColumn] as unknown as { id: string; name: string }[])

		return {
			headers, // list of companies
			rows, // list of payment methods
			fromDate,
			toDate
		}
	} catch (error) {
		console.error(error)
		if (error instanceof Error) {
			Sentry.captureException(error)
		}
		return redirect(307, '/error')
	}
}
