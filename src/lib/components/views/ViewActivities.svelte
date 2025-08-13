<script lang="ts" module>
	type Props = {
		key: string

		data: any
	}
</script>

<script lang="ts">
	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'
	import { TextBlock } from '$sveltewind/components/display'
	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell,
		TableColumnsToggle,
		TableNoResultsRow,
		TablePrint
	} from '$sveltewind/components/table'
	import { Pagination, Search } from '$sveltewind/components/filters'
	import { GhostButton } from '$sveltewind/components/buttons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'

	import UserLink from '$lib/components/links/UserLink.svelte'

	let { key, data }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			date: 'Date',
			type: 'Type',
			createdBy: 'Staff',
			details: 'Notes'
		})
	})
</script>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	{#if data.searchTerms}
		<Search terms={data.searchTerms}>
			{#snippet leftChildren()}
				{#if data.canViewAllActivities}
					<div
						class="flex w-fit min-w-48 items-center gap-1 overflow-x-auto overflow-y-hidden rounded-md bg-gray-100 p-1"
					>
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('createdBy', 'me')
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-slate-500)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap',
								page.url.searchParams.get('createdBy') === 'me' &&
									'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
							)}
						>
							My Activities
						</GhostButton>
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('createdBy', 'all')
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-slate-500)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap',
								page.url.searchParams.get('createdBy') === 'all' &&
									'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
							)}
						>
							All Activities
						</GhostButton>
					</div>
				{/if}
			{/snippet}
			{#snippet rightChildren()}
				{#if data.summary}
					<Pagination
						limit={25}
						totalCount={data.summary.totalCount}
						filterCount={data.summary.filterCount}
					/>
				{/if}
			{/snippet}
		</Search>
	{/if}

	<Table classContainer="pb-4 lg:h-[calc(100%-104px)] h-[calc(100%-216px)]">
		{#snippet tableHead()}
			<TableHeadRow>
				{#if columnsState.visibleColumns.includes('date')}
					<TableHead sortBy="date" class="min-w-48">Created At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('type')}
					<TableHead sortBy="type" class="min-w-90">Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('createdBy') && page.url.searchParams.get('createdBy') !== 'me'}
					<TableHead sortBy="createdBy" class="min-w-44">Staff</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead class="min-w-44">Details</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name={key} />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.activities ?? [] as activity (activity.id)}
				<TableCellRow>
					{#if columnsState.visibleColumns.includes('date')}
						<TableCell class="tabular-nums">
							<TextBlock
								>{new Date(activity.date).toLocaleString('en-CA', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit',
									hour12: false
								})}</TextBlock
							>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('type')}
						<TableCell>
							<TextBlock>
								{activity.type.replaceAll('_', ' ')}
							</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('createdBy') && page.url.searchParams.get('createdBy') !== 'me'}
						<TableCell>
							<UserLink user={activity.createdByUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('details')}
						<TableCell>
							<TextBlock>
								{activity.details || '-'}
							</TextBlock>
						</TableCell>
					{/if}
					{#if !printerState.isPrinting}
						<TableCell></TableCell>
					{/if}
				</TableCellRow>
			{:else}
				<TableNoResultsRow />
			{/each}
		{/snippet}
	</Table>
{/if}
