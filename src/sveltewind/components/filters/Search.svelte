<script lang="ts" module>
	type SearchQueryType = {
		term: string
		relation: string
		operator: SearchOperatorType
		value: string
		valueLabel?: string
	}

	export type SearchTermsType = Record<
		string,
		{
			isHidden?: boolean
			label: string
			field?: string
			type: string // 'string' | 'stringRestricted' | 'stringRestrictedOptional' | 'number' | 'boolean' | 'date' | 'select' | 'relation' | 'quickSearch'
			addTime?: boolean
			isEnum?: boolean
			options?: { value: string; label: string }[]
			loadMoreUrl?: string
			relationIsMany?: boolean
			relations?: SearchTermsType
			filters?: { field: string; relationIsMany?: boolean; relationField?: string; type?: string }[]
			placeholder?: string
		}
	>

	export type Props = {
		terms: SearchTermsType
		classContainer?: string
		class?: string
		leftChildren?: import('svelte').Snippet
		rightChildren?: import('svelte').Snippet
	}

	export const searchOperators = {
		contains: '~',
		notContains: '!~',
		startsWith: '^=',
		endsWith: '=$',
		isEmpty: '==',
		isNotEmpty: '!==',
		equals: '=',
		notEquals: '!=',
		notIn: '!in',
		in: 'in',
		lte: '<=',
		lt: '<',
		gte: '>=',
		gt: '>'
	}

	const operatorLabels = {
		contains: 'Contains',
		notContains: 'Does not contain',
		startsWith: 'Starts with',
		endsWith: 'Ends with',
		isEmpty: 'Is empty',
		isNotEmpty: 'Is not empty',
		equals: 'Equals',
		notEquals: 'Does not equal',
		notIn: 'Not in',
		in: 'In',
		lte: 'Less than or equal to',
		lt: 'Less than',
		gte: 'Greater than or equal to',
		gt: 'Greater than'
	}

	// https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators
	export type SearchOperatorType = keyof typeof searchOperators
	const typeOperators = {
		string: [
			'contains',
			'notContains',
			'startsWith',
			'endsWith',
			'equals',
			'notEquals',
			'in',
			'notIn',
			'isEmpty',
			'isNotEmpty'
		],
		stringRestricted: ['equals', 'notEquals'],
		stringRestrictedOptional: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
		number: ['equals', 'lt', 'lte', 'gt', 'gte', 'notEquals', 'isEmpty', 'isNotEmpty'],
		boolean: ['equals'],
		date: ['equals', 'lt', 'lte', 'gt', 'gte', 'notEquals', 'isEmpty', 'isNotEmpty'],
		datetime: ['equals', 'lt', 'lte', 'gt', 'gte', 'notEquals', 'isEmpty', 'isNotEmpty'],
		select: ['equals', 'notEquals', 'in', 'notIn'],
		quickSearch: ['contains']
	} as Record<string, SearchOperatorType[]>

	// function to transform the search queries into a prisma query
	export const searchQueriesToPrismaQuery = (url: URL, searchTerms: SearchTermsType) => {
		const AND = [] as any
		const searchQueries =
			(url.searchParams
				.get('q')
				?.split('_&_')
				.map((query) => {
					// split the query into an array of [term, operator, value]
					const [term, operator, value] = query.split(
						new RegExp(
							`(${Object.keys(searchOperators)
								.map((k) => `_${k}_`)
								.join('|')})`
						)
					) as [string, SearchOperatorType, string]
					let newTerm = term
					let relation = ''
					if (term.includes('.')) {
						;[newTerm, relation] = term.split('.')
					}
					return { term: newTerm, relation, operator: operator?.slice(1, -1), value }
				})
				.filter(
					(query) => !!searchTerms[query.term] && !!query.operator && query.value
				) as SearchQueryType[]) || []
		for (const { term, relation, operator, value } of searchQueries) {
			let searchValue = value.trim() as string | number | boolean | Date
			if (
				searchTerms[term].type === 'date' ||
				searchTerms[term]?.relations?.[relation].type === 'date'
			) {
				// modify the searchValue to be a Date
				searchValue = new Date(searchValue + 'T00:00:00.000') as Date
				const nextDay = new Date(searchValue)
				nextDay.setDate(nextDay.getDate() + 1)
				const addTime =
					searchTerms[term].addTime || searchTerms[term]?.relations?.[relation].addTime
				const searchCondition = {
					gte: addTime ? searchValue : searchValue.toISOString().slice(0, 10),
					lt: addTime ? nextDay : nextDay.toISOString().slice(0, 10)
				}
				if (!addTime) {
					searchValue = searchValue.toISOString().slice(0, 10)
				}
				// handle case for special name for field if different from SearchTermsType
				const actualField =
					searchTerms[term].field || searchTerms[term]?.relations?.[relation].field || term
				// handle special case for 'equals' and 'notEquals' operators - to search for a range of dates
				if (operator === 'equals') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								[actualField as string]: {
									some: {
										[relation]: searchCondition
									}
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									[relation]: searchCondition
								}
							})
						}
					} else
						AND.push({
							[actualField]: searchCondition
						})
				} else if (operator === 'notEquals') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								NOT: {
									[actualField as string]: {
										some: {
											[relation]: searchCondition
										}
									}
								}
							})
						} else {
							AND.push({
								NOT: {
									[actualField as string]: {
										[relation]: searchCondition
									}
								}
							})
						}
					} else {
						AND.push({
							NOT: {
								[actualField]: searchCondition
							}
						})
					}
				} else {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							if (operator === 'isEmpty') {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: null
										}
									}
								})
							} else if (operator === 'isNotEmpty') {
								AND.push({
									[actualField as string]: {
										some: {
											NOT: {
												[relation]: null
											}
										}
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: { [operator]: searchValue }
										}
									}
								})
							}
						} else {
							if (operator === 'isEmpty') {
								AND.push({
									[actualField as string]: null
								})
							} else if (operator === 'isNotEmpty') {
								AND.push({
									NOT: {
										[actualField as string]: null
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										[relation]: { [operator]: searchValue }
									}
								})
							}
						}
					} else {
						if (operator === 'isEmpty') {
							AND.push({
								[actualField]: null
							})
						} else if (operator === 'isNotEmpty') {
							AND.push({
								NOT: {
									[actualField]: null
								}
							})
						} else {
							AND.push({
								[actualField]: { [operator]: searchValue }
							})
						}
					}
				}
			} else if (
				searchTerms[term].type === 'datetime' ||
				searchTerms[term]?.relations?.[relation].type === 'datetime'
			) {
				// modify the searchValue to be a DateTime
				if (operator === 'isEmpty' || operator === 'isNotEmpty') {
					searchValue = '1999-01-01 00:00' // doesn't matter what this is
				}
				searchValue = new Date((searchValue + ':00.000') as string) as Date
				// set seconds to 0
				searchValue.setSeconds(0)
				const nextMinute = new Date(searchValue)
				nextMinute.setMinutes(nextMinute.getMinutes() + 1)
				const searchCondition = {
					gte: searchValue.toISOString(),
					lt: nextMinute.toISOString()
				}
				// handle case for special name for field if different from SearchTermsType
				const actualField =
					searchTerms[term].field || searchTerms[term]?.relations?.[relation].field || term
				// handle special case for 'equals' and 'notEquals' operators - to search for a range of dates
				if (operator === 'equals') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								[actualField as string]: {
									some: {
										[relation]: searchCondition
									}
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									[relation]: searchCondition
								}
							})
						}
					} else {
						AND.push({
							[actualField as string]: searchCondition
						})
					}
				} else if (operator === 'notEquals') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								NOT: {
									[actualField as string]: {
										some: {
											[relation]: searchCondition
										}
									}
								}
							})
						} else {
							AND.push({
								NOT: {
									[actualField as string]: {
										[relation]: searchCondition
									}
								}
							})
						}
					} else {
						AND.push({
							NOT: {
								[actualField]: searchCondition
							}
						})
					}
				} else {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							if (operator === 'isEmpty') {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: null
										}
									}
								})
							} else if (operator === 'isNotEmpty') {
								AND.push({
									[actualField as string]: {
										some: {
											NOT: {
												[relation]: null
											}
										}
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: { [operator]: searchValue.toISOString() }
										}
									}
								})
							}
						} else {
							if (operator === 'isEmpty') {
								AND.push({
									[actualField as string]: null
								})
							} else if (operator === 'isNotEmpty') {
								AND.push({
									NOT: {
										[actualField as string]: null
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										[relation]: { [operator]: searchValue.toISOString() }
									}
								})
							}
						}
					} else if (operator === 'isEmpty') {
						AND.push({
							[actualField]: null
						})
					} else if (operator === 'isNotEmpty') {
						AND.push({
							NOT: {
								[actualField]: null
							}
						})
					} else {
						AND.push({
							[actualField as string]: { [operator]: searchValue.toISOString() }
						})
					}
				}
			} else if (
				['string', 'stringRestricted', 'stringRestrictedOptional'].includes(
					searchTerms[term].type
				) ||
				['string', 'stringRestricted', 'stringRestrictedOptional'].includes(
					searchTerms[term]?.relations?.[relation].type as string
				)
			) {
				searchValue = (searchValue as string).toLowerCase()
				// handle case for special name for field if different from SearchTermsType
				const actualField =
					searchTerms[term].field || searchTerms[term]?.relations?.[relation].field || term
				// handle special case for 'in' and 'notIn' operators - to search for multiple values
				if (operator === 'in') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								[actualField as string]: {
									some: {
										OR: searchValue
											.split(',')
											.filter(Boolean)
											.map((value) => ({
												[relation]: {
													contains: value.trim(),
													mode: 'insensitive'
												}
											}))
									}
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									OR: searchValue
										.split(',')
										.filter(Boolean)
										.map((value) => ({
											[relation]: {
												contains: value.trim(),
												mode: 'insensitive'
											}
										}))
								}
							})
						}
					} else
						AND.push({
							OR: searchValue
								.split(',')
								.filter(Boolean)
								.map((value) => ({
									[actualField]: {
										contains: value.trim(),
										mode: 'insensitive'
									}
								}))
						})
				} else if (operator === 'notIn') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								NOT: {
									[actualField as string]: {
										some: {
											OR: searchValue
												.split(',')
												.filter(Boolean)
												.map((value) => ({
													[relation]: {
														contains: value.trim(),
														mode: 'insensitive'
													}
												}))
										}
									}
								}
							})
						} else {
							AND.push({
								NOT: {
									[actualField as string]: {
										OR: searchValue
											.split(',')
											.filter(Boolean)
											.map((value) => ({
												[relation]: {
													contains: value.trim(),
													mode: 'insensitive'
												}
											}))
									}
								}
							})
						}
					} else {
						AND.push({
							NOT: {
								OR: searchValue
									.split(',')
									.filter(Boolean)
									.map((value) => ({
										[actualField]: {
											contains: value.trim(),
											mode: 'insensitive'
										}
									}))
							}
						})
					}
				} else {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							if (operator === 'isEmpty') {
								AND.push({
									NOT: {
										[actualField as string]: {
											some: {
												[relation]: {
													AND: [
														{
															[actualField]: { not: null }
														},
														{
															[actualField]: { not: '' }
														}
													]
												}
											}
										}
									}
								})
							} else if (operator === 'isNotEmpty') {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: {
												AND: [
													{
														[actualField]: { not: null }
													},
													{
														[actualField]: { not: '' }
													}
												]
											}
										}
									}
								})
							} else if (operator === 'notEquals') {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: {
												[actualField]: { not: searchValue, mode: 'insensitive' }
											}
										}
									}
								})
							} else if (operator === 'notContains') {
								AND.push({
									NOT: {
										[actualField as string]: {
											some: {
												[relation]: {
													[actualField]: {
														contains: searchValue,
														mode: 'insensitive'
													}
												}
											}
										}
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: {
												[operator]: searchValue,
												mode: 'insensitive'
											}
										}
									}
								})
							}
						} else {
							if (operator === 'isEmpty') {
								AND.push({
									NOT: {
										[actualField as string]: {
											AND: [
												{
													[relation]: { not: null },
													[relation]: { not: '' }
												}
											]
										}
									}
								})
							} else if (operator === 'isNotEmpty') {
								AND.push({
									[actualField as string]: {
										AND: [
											{
												[relation]: { not: null },
												[relation]: { not: '' }
											}
										]
									}
								})
							} else if (operator === 'notEquals') {
								AND.push({
									[actualField as string]: {
										[relation]: { not: searchValue, mode: 'insensitive' }
									}
								})
							} else if (operator === 'notContains') {
								AND.push({
									[actualField as string]: {
										[relation]: {
											not: { contains: searchValue, mode: 'insensitive' }
										}
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										[relation]: {
											[operator]: searchValue,
											mode: 'insensitive'
										}
									}
								})
							}
						}
					} else {
						if (operator === 'isEmpty') {
							AND.push({
								NOT: { AND: [{ [actualField]: { not: null } }, { [actualField]: { not: '' } }] }
							})
						} else if (operator === 'isNotEmpty') {
							AND.push({
								AND: [{ [actualField]: { not: null } }, { [actualField]: { not: '' } }]
							})
						} else if (operator === 'notEquals') {
							AND.push({
								[actualField]: { not: searchValue }
							})
						} else if (operator === 'notContains') {
							AND.push({
								NOT: {
									[actualField]: {
										contains: searchValue,
										mode: 'insensitive'
									}
								}
							})
						} else {
							AND.push({
								[actualField]: {
									[operator]: searchValue,
									mode: 'insensitive'
								}
							})
						}
					}
				}
			} else if (
				searchTerms[term].type === 'number' ||
				searchTerms[term]?.relations?.[relation].type === 'number'
			) {
				searchValue = parseFloat(searchValue as string)
				// handle case for special name for field if different from SearchTermsType
				const actualField =
					searchTerms[term].field || searchTerms[term]?.relations?.[relation].field || term
				if (relation) {
					if (searchTerms[term].relationIsMany) {
						if (operator === 'isEmpty') {
							AND.push({
								NOT: {
									[actualField as string]: {
										some: {
											[relation]: { not: null }
										}
									}
								}
							})
						} else if (operator === 'isNotEmpty') {
							AND.push({
								[actualField as string]: {
									some: {
										[relation]: { not: null }
									}
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									some: {
										[relation]: {
											[operator]: searchValue
										}
									}
								}
							})
						}
					} else {
						if (operator === 'isEmpty') {
							AND.push({
								NOT: {
									[actualField as string]: {
										[relation]: { not: null }
									}
								}
							})
						} else if (operator === 'isNotEmpty') {
							AND.push({
								[actualField as string]: {
									[relation]: { not: null }
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									[relation]: {
										[operator]: searchValue
									}
								}
							})
						}
					}
				} else {
					if (operator === 'isEmpty') {
						AND.push({
							NOT: {
								[actualField]: { not: null }
							}
						})
					} else if (operator === 'isNotEmpty') {
						AND.push({
							[actualField]: { not: null }
						})
					} else {
						AND.push({
							[actualField]: {
								[operator]: searchValue
							}
						})
					}
				}
			} else if (
				searchTerms[term].type === 'boolean' ||
				searchTerms[term]?.relations?.[relation].type === 'boolean'
			) {
				searchValue = searchValue === 'true'
				// handle case for special name for field if different from SearchTermsType
				const actualField =
					searchTerms[term].field || searchTerms[term]?.relations?.[relation].field || term
				if (relation) {
					if (searchTerms[term].relationIsMany) {
						if (relation === 'isEmpty') {
							AND.push({
								[actualField]: { none: {} }
							})
						} else if (relation === 'isNotEmpty') {
							AND.push({
								[actualField]: { some: {} }
							})
						} else {
							AND.push({
								[actualField as string]: {
									some: {
										[relation]: {
											[operator]: searchValue
										}
									}
								}
							})
						}
					} else {
						if (relation === 'isEmpty') {
							AND.push({
								[actualField]: null
							})
						} else if (relation === 'isNotEmpty') {
							AND.push({
								NOT: {
									[actualField]: null
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									[relation]: {
										[operator]: searchValue
									}
								}
							})
						}
					}
				} else {
					AND.push({
						[actualField]: {
							[operator]: searchValue
						}
					})
				}
			} else if (
				searchTerms[term].type === 'select' ||
				searchTerms[term]?.relations?.[relation].type === 'select'
			) {
				searchValue = searchValue as string
				// handle case for special name for field if different from SearchTermsType
				const actualField =
					searchTerms[term].field || searchTerms[term]?.relations?.[relation].field || term
				if (operator === 'in') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							if (searchTerms[term]?.relations?.[relation].isEnum) {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: {
												in: searchValue.split(',').filter(Boolean)
											}
										}
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										some: {
											[relation]: {
												OR: searchValue
													.split(',')
													.filter(Boolean)
													.map((value) => ({
														[actualField]: {
															equals: value.trim(),
															mode: 'insensitive'
														}
													}))
											}
										}
									}
								})
							}
						} else {
							if (searchTerms[term]?.relations?.[relation].isEnum) {
								AND.push({
									[actualField as string]: {
										[relation]: {
											in: searchValue.split(',').filter(Boolean)
										}
									}
								})
							} else {
								AND.push({
									[actualField as string]: {
										[relation]: {
											OR: searchValue
												.split(',')
												.filter(Boolean)
												.map((value) => ({
													[actualField]: {
														equals: value.trim(),
														mode: 'insensitive'
													}
												}))
										}
									}
								})
							}
						}
					} else if (searchTerms[term].isEnum) {
						AND.push({
							in: searchValue.split(',').filter(Boolean)
						})
					} else {
						AND.push({
							OR: searchValue
								.split(',')
								.filter(Boolean)
								.map((value) => ({
									[actualField]: {
										equals: value.trim(),
										mode: 'insensitive'
									}
								}))
						})
					}
				} else if (operator === 'notIn') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							if (searchTerms[term]?.relations?.[relation].isEnum) {
								AND.push({
									NOT: {
										[actualField as string]: {
											some: {
												[relation]: {
													in: searchValue.split(',').filter(Boolean)
												}
											}
										}
									}
								})
							} else {
								AND.push({
									NOT: {
										[actualField as string]: {
											some: {
												[relation]: {
													OR: searchValue
														.split(',')
														.filter(Boolean)
														.map((value) => ({
															[actualField]: {
																equals: value.trim(),
																mode: 'insensitive'
															}
														}))
												}
											}
										}
									}
								})
							}
						} else {
							if (searchTerms[term]?.relations?.[relation].isEnum) {
								AND.push({
									NOT: {
										[actualField as string]: {
											[relation]: {
												in: searchValue.split(',').filter(Boolean)
											}
										}
									}
								})
							} else {
								AND.push({
									NOT: {
										[actualField as string]: {
											[relation]: {
												OR: searchValue
													.split(',')
													.filter(Boolean)
													.map((value) => ({
														[actualField]: {
															equals: value.trim(),
															mode: 'insensitive'
														}
													}))
											}
										}
									}
								})
							}
						}
					} else {
						if (searchTerms[term].isEnum) {
							AND.push({
								NOT: {
									in: searchValue.split(',').filter(Boolean)
								}
							})
						} else {
							AND.push({
								NOT: {
									OR: searchValue
										.split(',')
										.filter(Boolean)
										.map((value) => ({
											[actualField]: { equals: value.trim(), mode: 'insensitive' }
										}))
								}
							})
						}
					}
				} else if (operator === 'notEquals') {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								NOT: {
									[actualField as string]: {
										some: {
											[relation]: {
												equals: searchValue,
												mode: 'insensitive'
											}
										}
									}
								}
							})
						} else {
							AND.push({
								NOT: {
									[actualField as string]: {
										[relation]: {
											equals: searchValue,
											mode: 'insensitive'
										}
									}
								}
							})
						}
					} else {
						AND.push({
							NOT: {
								[actualField]: {
									equals: searchValue,
									mode: 'insensitive'
								}
							}
						})
					}
				} else {
					if (relation) {
						if (searchTerms[term].relationIsMany) {
							AND.push({
								[actualField as string]: {
									some: {
										[relation]: {
											[operator]: searchValue
										}
									}
								}
							})
						} else {
							AND.push({
								[actualField as string]: {
									[relation]: {
										[operator]: searchValue
									}
								}
							})
						}
					} else {
						AND.push({
							[actualField]: {
								[operator]: searchValue
							}
						})
					}
				}
			} else if (
				(searchTerms[term].type === 'quickSearch' ||
					searchTerms[term]?.relations?.[relation].type === 'quickSearch') &&
				(searchTerms[term].filters || searchTerms[term]?.relations?.[relation].filters)
			) {
				const filters =
					searchTerms[term].filters || searchTerms[term]?.relations?.[relation].filters
				if (!filters) continue
				if (searchTerms[term]?.relations?.[relation].type === 'quickSearch') {
					AND.push({
						OR: Object.values(filters).map((filter) => {
							if (filter.relationField) {
								if (filter.relationIsMany) {
									return {
										[term]: {
											some: {
												[filter.field]: {
													some: {
														[filter.relationField]:
															filter.type === 'number'
																? { equals: parseInt(searchValue as string) }
																: { contains: searchValue, mode: 'insensitive' }
													}
												}
											}
										}
									}
								} else {
									return {
										[term]: {
											some: {
												[filter.field]: {
													[filter.relationField]:
														filter.type === 'number'
															? { equals: parseInt(searchValue as string) }
															: { contains: searchValue, mode: 'insensitive' }
												}
											}
										}
									}
								}
							} else {
								if (filter.relationIsMany) {
									return {
										[term]: {
											some: {
												[filter.field]:
													filter.type === 'number'
														? { equals: parseInt(searchValue as string) }
														: { contains: searchValue, mode: 'insensitive' }
											}
										}
									}
								} else {
									return {
										[term]: {
											[filter.field]:
												filter.type === 'number'
													? { equals: parseInt(searchValue as string) }
													: { contains: searchValue, mode: 'insensitive' }
										}
									}
								}
							}
						})
					})
				} else {
					AND.push({
						OR: Object.values(filters).map((filter) => {
							if (filter.relationField) {
								if (filter.relationIsMany) {
									return {
										[filter.field]: {
											some: {
												[filter.relationField]: {
													contains: searchValue,
													mode: 'insensitive'
												}
											}
										}
									}
								} else {
									return {
										[filter.field]: {
											[filter.relationField]: {
												contains: searchValue,
												mode: 'insensitive'
											}
										}
									}
								}
							} else {
								return { [filter.field]: { contains: searchValue, mode: 'insensitive' } }
							}
						})
					})
				}
			}
		}
		return AND
	}

	// function to transform sort terms into prisma orderBy query
	export const sortTermsToPrismaQuery = (url: URL, sortTerms: Record<string, string | null>) => {
		const sortBy = [] as any[]
		let sortByParam = url.searchParams.get('sortBy')
		if (sortByParam && Object.keys(sortTerms).find((sortTerm) => sortByParam?.includes(sortTerm))) {
			if (sortByParam.startsWith('-')) {
				sortByParam = sortByParam.slice(1)
				const sortField = sortTerms[sortByParam as keyof typeof sortTerms]
				if (sortField) {
					sortBy.push({ [sortByParam]: { [sortField]: `asc` } })
				} else {
					sortBy.push({ [sortByParam]: `asc` })
				}
			} else {
				const sortField = sortTerms[sortByParam as keyof typeof sortTerms]
				if (sortField) {
					sortBy.push({ [sortByParam]: { [sortField]: `desc` } })
				} else {
					sortBy.push({ [sortByParam]: `desc` })
				}
			}
		}
		return sortBy
	}
</script>

<script lang="ts">
	import { SelectInput, TextInput, DateInput, DateTimeInput, MultiSelectInput } from '../inputs'
	import { GhostButton } from '../buttons'
	import { XMarkIcon, SearchIcon } from '../../icons'

	import { twMerge } from 'tailwind-merge'

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { tick, untrack } from 'svelte'

	let { terms = {}, classContainer, class: classes, leftChildren, rightChildren }: Props = $props()

	let searchQueries = $state([]) as SearchQueryType[]

	$effect(() => {
		const url = new URL(page.url)
		const searchQuery = url.searchParams.get('q')
		if (!searchQuery) {
			searchQueries = []
		}
	})

	const transformSearchQueries = (searchQueries: SearchQueryType[]) => {
		return fetch('/_api/transformSearchQueries', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ searchQueries, basePath: page.url.pathname })
		})
			.then((res) => res.json())
			.then((data) => {
				return data
			})
	}
	$effect(() => {
		// update initial searchQueries from page.url.searchParams.get('q') separated by _&_
		untrack(async () => {
			const url = new URL(page.url)
			const searchQuery = url.searchParams.get('q')
			if (searchQuery) {
				searchQueries = searchQuery
					.split('_&_')
					.map((query) => {
						// split the query into an array of [term, operator, value]
						let [term, operator, value] = query.split(
							new RegExp(
								`(${Object.keys(searchOperators)
									.map((k) => `_${k}_`)
									.join('|')})`
							)
						) as [string, SearchOperatorType, string]
						let relation = ''
						if (term.includes('.')) {
							;[term, relation] = term.split('.')
						}
						return { term, relation, operator: operator?.slice(1, -1), value }
					})
					.filter(
						(query) => !!terms[query.term] && !!query.operator && query.value
					) as SearchQueryType[]
				searchQueries = await transformSearchQueries(searchQueries)
				if (searchQueries.length === 0) {
					// if there are no search queries, remove the 'q' param from the url
					url.searchParams.delete('q')
					goto(url.toString(), { noScroll: true, replaceState: true })
				} else {
					// update the url to reflect the validated search queries
					url.searchParams.set(
						'q',
						searchQueries
							.map((q) => `${q.term}${q.relation ? `.${q.relation}` : ''}_${q.operator}_${q.value}`)
							.join('_&_')
					)
					goto(url.toString(), { noScroll: true, replaceState: true })
				}
			}
		})
	})

	let currentSearch = $state(['quickSearch', '', 'contains', '']) as [
		string,
		string,
		string,
		string
	]

	let operatorOptions = $state([]) as { value: string; label: string }[]
	$effect(() => {
		if (currentSearch[0]) {
			const fieldName = currentSearch[0]
			if (terms[fieldName]?.relations && !currentSearch[1]) return
			const fieldType = terms[fieldName]?.relations
				? terms[fieldName]?.relations?.[currentSearch[1]].type
				: (terms[fieldName]?.type as keyof typeof typeOperators)
			operatorOptions = typeOperators[fieldType as string].map((operator) => ({
				value: operator,
				label: operatorLabels[operator]
			}))
		}
	})

	let fieldRef = $state() as HTMLInputElement
	let relationRef = $state() as HTMLInputElement
	let operatorRef = $state() as HTMLInputElement
	let valueRef = $state() as HTMLInputElement

	const onSearch = async (e: Event) => {
		e.preventDefault()
		e.stopPropagation()
		const url = new URL(page.url)
		if (currentSearch.filter((s) => s !== '').length >= 3) {
			searchQueries = [
				...searchQueries,
				{
					term: currentSearch[0],
					relation: currentSearch[1],
					operator: currentSearch[2],
					value: currentSearch[3] as string
				}
			] as SearchQueryType[]
			currentSearch[3] = ''
			await tick()
			currentSearch = ['quickSearch', '', 'contains', '']
			url.searchParams.set(
				'q',
				searchQueries
					.map(
						(query) =>
							`${query.term}${query.relation ? `.${query.relation}` : ''}_${query.operator}_${query.value}`
					)
					.join('_&_')
			)
			goto(url.toString(), { noScroll: true, replaceState: true })
		}
	}

	const clearAll = () => {
		searchQueries = []
		const url = new URL(page.url)
		url.searchParams.delete('q')
		goto(url.toString(), { noScroll: true, replaceState: true })
	}
</script>

<form
	class={twMerge(
		'mb-2 flex max-h-52 w-full flex-col rounded-md px-3 py-2 text-sm bg-slate-800/50 border border-slate-700 transition-all placeholder:text-xs lg:max-h-24',
		classContainer
	)}
	onsubmit={onSearch}
>
	<div class={twMerge('flex flex-col items-center gap-2 lg:flex-row', classes)}>
		<SelectInput
			bind:inputRef={fieldRef}
			bind:value={currentSearch[0]}
			placeholder="Filter"
			options={Object.entries(terms)
				.filter(([, { isHidden }]) => !isHidden)
				.map(([field, { label }]) => ({ value: field, label }))}
			hideIcon
			classContainer="w-full lg:w-fit"
			onSelect={async (option) => {
				if (option.value) {
					if (terms[option.value]?.type === 'relation') {
						// default to the first relation and its first operator
						currentSearch[1] = Object.keys(terms[option.value]?.relations || {})[0]
						const fieldType = terms[option.value]?.relations?.[currentSearch[1]]
							?.type as keyof typeof typeOperators
						currentSearch[2] = typeOperators[fieldType][0]
						await tick()
						valueRef.focus()
						valueRef.click()
					} else {
						// default to the first operator
						const fieldType = terms[option.value]?.type as keyof typeof typeOperators
						currentSearch[2] = typeOperators[fieldType][0]
						currentSearch[1] = ''
						await tick()
						// if (terms[option.value]?.type === 'boolean') {
						// 	// default to true and perform the search
						// 	valueRef.value = 'true'
						// 	currentSearch[3] = 'true'
						// 	await tick()
						// 	onSearch(new Event('submit'))
						// } else {
						valueRef.focus()
						valueRef.click()
						// }
					}
				} else {
					currentSearch[1] = ''
					currentSearch[2] = ''
					currentSearch[3] = ''
				}
			}}
		/>
		{#if currentSearch[0] && !!terms[currentSearch[0]]?.relations}
			<SelectInput
				bind:inputRef={relationRef}
				placeholder="Sub Filter"
				bind:value={currentSearch[1]}
				options={Object.entries(terms[currentSearch[0]]?.relations || ({} as SearchTermsType))
					.filter(([, { isHidden }]) => !isHidden)
					.map(([field, { label }]) => ({ value: field, label }))}
				classContainer="w-full lg:w-fit"
				hideIcon
				onSelect={async (option) => {
					if (option.value) {
						// default to the first operator
						const fieldType = terms[currentSearch[0]]?.relations?.[option.value]
							?.type as keyof typeof typeOperators
						currentSearch[2] = typeOperators[fieldType][0]
						if (option.value === 'quickSearch') {
							currentSearch[3] = ''
						}
						await tick()
						valueRef.focus()
						valueRef.click()
					} else {
						currentSearch[1] = ''
						currentSearch[2] = ''
						currentSearch[3] = ''
					}
				}}
			/>
		{/if}
		{#if currentSearch[0] !== 'quickSearch' && currentSearch[1] !== 'quickSearch' && terms[currentSearch[0]]?.type !== 'boolean'}
			<SelectInput
				bind:inputRef={operatorRef}
				placeholder="Operator"
				isDisabled={!currentSearch[0]}
				bind:value={currentSearch[2]}
				options={operatorOptions}
				classContainer="w-full lg:w-fit"
				classInput="max-w-24 "
				hideIcon
				onSelect={async () => {
					await tick()
					valueRef.focus()
					valueRef.click()
					if (currentSearch[2] === 'isEmpty' || currentSearch[2] === 'isNotEmpty') {
						currentSearch[3] = 'NULL'
						await tick()
						onSearch(new Event('submit'))
					}
				}}
			/>
		{/if}
		{#if terms[currentSearch[0]]?.type === 'date' || terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.type === 'date'}
			<DateInput
				bind:inputRef={valueRef}
				placeholder="Search..."
				isDisabled={!currentSearch[0] || !currentSearch[2]}
				bind:value={currentSearch[3] as string}
				classContainer={twMerge(
					'py-0 flex-1 w-full lg:w-fit',
					(!currentSearch[0] || !currentSearch[2]) && 'py-0.5'
				)}
				onSelect={async () => {
					await tick()
					onSearch(new Event('submit'))
				}}
			/>
		{:else if terms[currentSearch[0]]?.type === 'datetime' || terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.type === 'datetime'}
			<DateTimeInput
				bind:inputRef={valueRef}
				bind:value={currentSearch[3] as string}
				placeholder="Search..."
				isDisabled={!currentSearch[0] || !currentSearch[2]}
				classContainer={twMerge(
					'py-0 flex-1 w-full lg:w-fit',
					(!currentSearch[0] || !currentSearch[2]) && 'py-0.5'
				)}
				onSelect={async () => {
					await tick()
					onSearch(new Event('submit'))
				}}
			/>
		{:else if terms[currentSearch[0]]?.type === 'boolean' || terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.type === 'boolean'}
			<SelectInput
				bind:inputRef={valueRef}
				isDisabled={!currentSearch[0] || !currentSearch[2]}
				bind:value={currentSearch[3] as string}
				options={[
					{ value: 'true', label: 'TRUE' },
					{ value: 'false', label: 'FALSE' }
				]}
				hiddenOptionValues={currentSearch[1] === 'isEmpty' || currentSearch[2] === 'isEmpty'
					? ['false']
					: []}
				hideIcon
				classContainer="w-full lg:w-fit "
				onSelect={async () => {
					await tick()
					onSearch(new Event('submit'))
				}}
			/>
		{:else if terms[currentSearch[0]]?.type === 'select' || terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.type === 'select'}
			{#if ['in', 'notIn'].includes(currentSearch[2])}
				{#key terms[currentSearch[0]].loadMoreUrl || terms[currentSearch[0]]?.relations?.[currentSearch[1]].loadMoreUrl}
					<MultiSelectInput
						bind:inputRef={valueRef}
						isDisabled={!currentSearch[0] || !currentSearch[2]}
						values={currentSearch[3] ? currentSearch[3].split(',') : []}
						options={terms[currentSearch[0]].options ||
							terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.options ||
							[]}
						loadMoreUrl={terms[currentSearch[0]].loadMoreUrl ||
							terms[currentSearch[0]]?.relations?.[currentSearch[1]].loadMoreUrl}
						hideIcon
						classContainer="w-full lg:w-fit "
						onSelect={async (options) => {
							currentSearch[3] = options?.map((option) => option.value).join(',') || ''
							await tick()
						}}
					/>
				{/key}
			{:else}
				{#key terms[currentSearch[0]].loadMoreUrl || terms[currentSearch[0]]?.relations?.[currentSearch[1]].loadMoreUrl}
					<SelectInput
						bind:inputRef={valueRef}
						isDisabled={!currentSearch[0] || !currentSearch[2]}
						bind:value={currentSearch[3] as string}
						options={terms[currentSearch[0]]?.options ||
							terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.options ||
							[]}
						loadMoreUrl={terms[currentSearch[0]].loadMoreUrl ||
							terms[currentSearch[0]]?.relations?.[currentSearch[1]].loadMoreUrl}
						hideIcon
						classContainer="w-full lg:w-fit "
						onSelect={async () => {
							await tick()
							onSearch(new Event('submit'))
						}}
					/>
				{/key}
			{/if}
		{:else}
			<TextInput
				type={terms[currentSearch[0]]?.type === 'number' ||
				terms[currentSearch[1]]?.type === 'number'
					? 'number'
					: 'text'}
				step=".01"
				bind:inputRef={valueRef}
				placeholder={terms[currentSearch[0]]?.placeholder ||
					terms[currentSearch[0]]?.relations?.[currentSearch[1]]?.placeholder ||
					'Search...'}
				isDisabled={!currentSearch[0] ||
					!currentSearch[2] ||
					currentSearch[2] === 'isEmpty' ||
					currentSearch[2] === 'isNotEmpty'}
				bind:value={currentSearch[3] as string}
				classContainer={twMerge(
					'py-0.5 flex-1 w-full lg:w-fit',
					(!currentSearch[0] || !currentSearch[2]) && 'py-0'
				)}
			>
				{#snippet bottomChildren()}
					{#if ['in', 'notIn'].includes(currentSearch[2])}
						<span class="text-xs text-blue-400">Enter multiple values separated by comma</span>
					{/if}
				{/snippet}
			</TextInput>
		{/if}
		{#if currentSearch.filter((s) => s !== '').length >= 3}
			<GhostButton type="submit" class="ml-1 p-1">
				<SearchIcon />
			</GhostButton>
		{/if}
	</div>
	<div
		class={twMerge(
			'flex flex-col pt-4 lg:flex-row lg:items-center',
			searchQueries.length === 0 && !leftChildren && 'justify-end',
			(searchQueries.length > 0 || leftChildren) && 'justify-between'
		)}
	>
		<div class="flex items-center gap-4 overflow-x-auto">
			{#if leftChildren}
				{@render leftChildren()}
			{/if}
			{#if searchQueries.length > 0}
				<div class="mb-2 flex items-center gap-2 overflow-x-auto lg:mb-0">
					{#each searchQueries as query, idx (query)}
						<div class="flex flex-none items-center rounded-md bg-amber-300 text-xs">
							<GhostButton
								onclick={async () => {
									currentSearch = [query.term, query.relation, query.operator, query.value]
									searchQueries = searchQueries.filter((_, i) => i !== idx)
									// update the url to reflect the search queries
									const url = new URL(page.url)
									url.searchParams.set(
										'q',
										searchQueries
											.map(
												(q) =>
													`${q.term}${q.relation ? `.${q.relation}` : ''}_${q.operator}_${q.value}`
											)
											.join('_&_')
									)
									if (searchQueries.length === 0) {
										url.searchParams.delete('q')
									}
									goto(url.toString(), { noScroll: true, replaceState: true, keepFocus: true })
									await tick()
									valueRef.focus()
									valueRef.click()
								}}
								class="max-w-[20rem] gap-0 overflow-scroll px-1.5 text-start font-semibold text-nowrap"
							>
								<div class="text-xs text-gray-600">
									{query.valueLabel && query.term === 'id' ? '' : query.term}
								</div>
								{#if query.relation && !query.valueLabel}
									<div class="text-xs text-gray-600">.</div>
									<div class="text-xs text-gray-600">{query.relation}</div>
								{/if}
								<div class="px-1 text-xs text-blue-600">{searchOperators[query.operator]}</div>
								<div class="text-extrabold text-xs text-gray-900">
									{query.valueLabel || query.value}
								</div>
							</GhostButton>
							<GhostButton
								--color-ghostButton="var(--color-red-600)"
								onclick={() => {
									searchQueries = searchQueries.filter((q) => q !== query)
									const url = new URL(page.url)
									url.searchParams.set(
										'q',
										searchQueries
											.map(
												(q) =>
													`${q.term}${q.relation ? `.${q.relation}` : ''}_${q.operator}_${q.value}`
											)
											.join('_&_')
									)
									if (searchQueries.length === 0) {
										url.searchParams.delete('q')
									}
									goto(url.toString(), { noScroll: true, replaceState: true })
								}}
								class="px-1.5"
							>
								<XMarkIcon class="size-4" />
							</GhostButton>
						</div>
					{/each}
					{#if searchQueries.length > 1}
						<GhostButton class="gap-0 px-1 py-1.5 text-xs" onclick={clearAll}>
							<XMarkIcon />
							<span class="text-nowrap">Clear All</span>
						</GhostButton>
					{/if}
				</div>
			{/if}
		</div>
		{#if rightChildren}
			{@render rightChildren()}
		{/if}
	</div>
</form>
