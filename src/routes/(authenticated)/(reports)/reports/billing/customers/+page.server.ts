import { graphqlFetchAction, stats } from '$lib/utils'
import { getCustomerFilters } from '$lib/utils/filters'
import { searchQueriesToPrismaQuery } from '$sveltewind/components/filters/Search.svelte'

export async function load({ fetch, url }) {
	const [from, to] = stats.validateFromTo(url.searchParams.get('from'), url.searchParams.get('to'))
	const groupBy = url.searchParams.get('groupBy')?.split(',').filter(Boolean) || []
	const where = {} as Record<string, unknown>
	const searchTerms = getCustomerFilters()
	const AND = searchQueriesToPrismaQuery(url, searchTerms)
	if (AND.length) {
		where.AND = AND
	}
	const [data, errors] = await graphqlFetchAction({
		fetch,
		query: `
			query CUSTOMER_REPORT_V2($startDate: String!, $endDate: String!, $groupByFilter: [String], $whereFilter: CustomerWhereInput) {
        customerReportV2(startDate: $startDate, endDate: $endDate, groupByFilter: $groupByFilter, whereFilter: $whereFilter)
			}
		`,
		variables: {
			startDate: from,
			endDate: to,
			groupByFilter: groupBy,
			whereFilter: where
		}
	})

	if (errors) {
		return { errors }
	}

	return {
		from,
		to,
		groupBy,
		searchTerms,
		report: data.customerReportV2
	}
}
