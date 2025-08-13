<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Customers Report'

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
	import Chart from '$lib/components/ui/chart.svelte'
	import Card from '$lib/components/ui/card.svelte'

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
		{ label: 'Joined Date', value: 'joinedDate' },
		{ label: 'City', value: 'city' },
		{ label: 'Postal Code', value: 'postalCode' },
		{ label: 'Province', value: 'province' },
		{ label: 'Country', value: 'country' },
		{ label: 'Source', value: 'sourceID' },
		{ label: 'Language', value: 'languageID' },
		{ label: 'Send Reminder By', value: 'sendReminderBy' },
		{ label: 'Handled By', value: 'handledBy' },
		{ label: 'Is Deleted`', value: 'isDeleted' },
		{ label: 'Is From Call', value: 'isFromCall' },
		{ label: 'Is Trial', value: 'isTrial' },
		{ label: 'Skip Promotion', value: 'skipPromotion' },
		{ label: 'Created By', value: 'createdBy' },
		{ label: 'Updated By', value: 'updatedBy' }
	]

	// Prepare chart data
	let chartData = $derived.by(() => {
		if (!data.report || data.report.length === 0) return []
		
		return data.report.map(row => ({
			period: row.period,
			count: row.results.reduce((sum, r) => sum + (r.count || 0), 0)
		}))
	})

	let pieData = $derived.by(() => {
		if (!data.report || data.report.length === 0 || groupBy.length === 0) return []
		
		const aggregated: Record<string, number> = {}
		data.report.forEach(row => {
			row.results.forEach(result => {
				const key = result[groupBy[0]] || 'Other'
				aggregated[key] = (aggregated[key] || 0) + (result.count || 0)
			})
		})
		
		return Object.entries(aggregated)
			.map(([name, value]) => ({ name, value }))
			.sort((a, b) => b.value - a.value)
			.slice(0, 10) // Top 10
	})

	let showCharts = $state(true)
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
	<!-- Charts Section -->
	{#if showCharts && data.report && data.report.length > 0}
		<div class="mb-6 grid gap-4 lg:grid-cols-2">
			<Card variant="default" className="p-4">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold text-white">Customer Trends</h3>
					<div class="flex gap-2">
						<button
							onclick={() => showCharts = !showCharts}
							class="rounded-lg bg-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-600"
						>
							{showCharts ? 'Hide' : 'Show'} Charts
						</button>
					</div>
				</div>
				<Chart 
					data={chartData} 
					type="area"
					dataKey="count"
					xAxisKey="period"
					height={300}
					colors={['#06b6d4']}
				/>
			</Card>

			{#if groupBy.length > 0 && pieData.length > 0}
				<Card variant="default" className="p-4">
					<div class="mb-4">
						<h3 class="text-lg font-semibold text-white">
							Top 10 by {GROUP_BY_OPTIONS.find(o => o.value === groupBy[0])?.label}
						</h3>
					</div>
					<Chart 
						data={pieData} 
						type="pie"
						dataKey="value"
						height={300}
					/>
				</Card>
			{:else}
				<Card variant="default" className="p-4">
					<div class="mb-4">
						<h3 class="text-lg font-semibold text-white">Daily Breakdown</h3>
					</div>
					<Chart 
						data={chartData} 
						type="bar"
						dataKey="count"
						xAxisKey="period"
						height={300}
						colors={['#8b5cf6']}
					/>
				</Card>
			{/if}
		</div>

		<!-- Stats Cards -->
		<div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card variant="default" className="p-4">
				<p class="text-sm text-slate-400">Total Customers</p>
				<p class="text-2xl font-bold text-white">
					{data.report.reduce((sum, row) => sum + row.results.reduce((s, r) => s + (r.count || 0), 0), 0).toLocaleString()}
				</p>
			</Card>
			<Card variant="default" className="p-4">
				<p class="text-sm text-slate-400">Average Daily</p>
				<p class="text-2xl font-bold text-white">
					{Math.round(data.report.reduce((sum, row) => sum + row.results.reduce((s, r) => s + (r.count || 0), 0), 0) / Math.max(1, data.report.length)).toLocaleString()}
				</p>
			</Card>
			<Card variant="default" className="p-4">
				<p class="text-sm text-slate-400">Peak Day</p>
				<p class="text-2xl font-bold text-white">
					{Math.max(...data.report.map(row => row.results.reduce((s, r) => s + (r.count || 0), 0))).toLocaleString()}
				</p>
			</Card>
			<Card variant="default" className="p-4">
				<p class="text-sm text-slate-400">Period</p>
				<p class="text-lg font-bold text-white">
					{data.report.length} days
				</p>
			</Card>
		</div>
	{/if}

	<!-- Data Table -->
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
					<TablePrint name={`Customers from ${fromDate} to ${toDate} by ${groupBy.join(',')}`} />
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
