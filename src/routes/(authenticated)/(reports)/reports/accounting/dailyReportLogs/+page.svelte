<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Daily Report Logs Report'

	import { DateInput } from '$sveltewind/components/inputs'

	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell,
		TableNoResultsRow,
		TablePrint
	} from '$sveltewind/components/table'
	import { Search } from '$sveltewind/components/filters'
	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { untrack } from 'svelte'
	import MultiSelectInput from '$sveltewind/components/inputs/MultiSelectInput.svelte'
	import SaveToQuickReport from '$lib/components/forms/SaveToQuickReport.svelte'

	let { data } = $props()

	const today = new Date().toLocaleDateString('en-CA')

	let groupBy = $state(data.groupBy || [])
	let fromDate = $state(data.from || today)
	let toDate = $state(data.to || today)

	$effect(() => {
		untrack(() => {
			// reset the url
			const url = new URL(page.url)
			if (groupBy.length > 0) {
				url.searchParams.set('groupBy', groupBy.join(','))
			}
			url.searchParams.set('from', fromDate)
			url.searchParams.set('to', toDate)
			goto(url.toString(), { replaceState: true })
		})
	})

	function onDateRangeChange(e: Event) {
		e.preventDefault()
		const url = new URL(page.url)
		if (groupBy.length > 0) {
			url.searchParams.set('groupBy', groupBy.join(','))
		} else {
			url.searchParams.delete('groupBy')
		}
		url.searchParams.set('from', fromDate)
		url.searchParams.set('to', toDate)
		goto(url.toString(), { replaceState: true, keepFocus: true })
	}

	const GROUP_BY_OPTIONS = [
		{ label: 'Transaction Type', value: 'transactionType' },
		{ label: 'Sales Person', value: 'salesPersonID' },
		{ label: 'Company', value: 'companyID' },
		{ label: 'Need Verification', value: 'needVerification' },
		{ label: 'Need Verify Enabled', value: 'needVerifyEnabledByID' },
		{ label: 'Need Verify Disabled', value: 'needVerifyDisabledByID' },
		{ label: 'Created By', value: 'createdBy' },
		{ label: 'Updated By', value: 'updatedBy' }
	]
</script>

<div class="flex flex-col items-end gap-4 lg:flex-row">
	<form
		class="mb-2 flex w-full items-center justify-between gap-2 lg:w-fit"
		onsubmit={onDateRangeChange}
	>
		<MultiSelectInput
			label="Group by"
			name="groupBy"
			bind:values={groupBy}
			options={GROUP_BY_OPTIONS}
			onSelect={(values) => {
				if (values) {
					onDateRangeChange(new Event('submit'))
				}
			}}
			classContainer="py-3"
			classInput="w-32 lg:w-40 text-xs pt-1.5"
			hideIcon
		/>
		<DateInput
			label="From"
			bind:value={fromDate}
			min={new Date('2021-01-01' + 'T00:00:00')}
			max={new Date(toDate + 'T00:00:00')}
			onSelect={() => {
				onDateRangeChange(new Event('submit'))
			}}
			classContainer="w-24 lg:w-32 text-xs py-2.5"
		/>
		<DateInput
			label="To"
			bind:value={toDate}
			min={new Date(fromDate + 'T00:00:00')}
			max={new Date(today + 'T00:00:00')}
			onSelect={() => {
				onDateRangeChange(new Event('submit'))
			}}
			classContainer="w-24 lg:w-32 text-xs py-2.5"
		/>
	</form>

	{#if data.searchTerms}
		<Search terms={data.searchTerms}></Search>
	{/if}
</div>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	<Table classContainer="my-4 h-[calc(100%-248px)] lg:h-[calc(100%-98px)]">
		{#snippet tableHead()}
			<TableHeadRow>
				<TableHead class="min-w-44 text-xs uppercase">Period</TableHead>
				{#each groupBy as group (group)}
					<TableHead class="min-w-44 text-xs uppercase">
						{GROUP_BY_OPTIONS.find((o) => o.value === group)?.label}
					</TableHead>
				{/each}
				<TableHead class="min-w-0 text-xs uppercase">Count</TableHead>
				<TableHead class="min-w-0 ">
					<TablePrint
						name={`DailyReportLogs from ${fromDate} to ${toDate} by ${groupBy.join(',')}`}
					/>
					<SaveToQuickReport />
				</TableHead>
			</TableHeadRow>
		{/snippet}
		{#snippet tableRows()}
			{#each data.report as row (row)}
				<TableCellRow>
					<TableCell class="text-sm">{row.period}</TableCell>
					{#each groupBy as group (group)}
						<TableCell class="text-sm">
							<div class="flex flex-col gap-2">
								{#each row.results as result (result)}
									<div>{result[group] || '-'}</div>
								{:else}
									<div>-</div>
								{/each}
							</div>
						</TableCell>
					{/each}
					<TableCell class="text-sm">
						<div class="flex flex-col gap-2 text-right font-semibold tabular-nums">
							{#each row.results as result (result)}
								<div>{Intl.NumberFormat('en-CA').format(result.count) || '-'}</div>
							{:else}
								<div>-</div>
							{/each}
						</div>
					</TableCell>
					<TableCell></TableCell>
				</TableCellRow>
			{:else}
				<TableNoResultsRow />
			{/each}
		{/snippet}
	</Table>
{/if}
