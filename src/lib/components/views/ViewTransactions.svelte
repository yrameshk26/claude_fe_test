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
	import { EditIcon } from '$sveltewind/icons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import ServiceLink from '$lib/components/links/ServiceLink.svelte'
	import CustomerLink from '$lib/components/links/CustomerLink.svelte'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import UserLink from '$lib/components/links/UserLink.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'
	import { twMerge } from 'tailwind-merge'

	let { key, data }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			date: 'Date',
			transactionType: 'Type',
			transactionNumber: 'Number',
			credits: 'Credits',
			service: 'Service',
			customer: 'Customer',
			shipment: 'Shipment',
			handledByUser: 'Handled By',
			notes: 'Notes'
		})
	})
</script>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	{#if data.searchTerms}
		<Search terms={data.searchTerms}>
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
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0"></TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('date')}
					<TableHead sortBy="date" class="min-w-32">Date</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('transactionType')}
					<TableHead sortBy="transactionType" class="min-w-24">Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('transactionNumber')}
					<TableHead sortBy="transactionNumber" class="min-w-28">Number</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('credits')}
					<TableHead sortBy="credits" class="min-w-24">Credits</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('service')}
					<TableHead sortBy="serviceType" class="min-w-32">Service</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('customer')}
					<TableHead sortBy="customer" class="min-w-40">Customer</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('shipment')}
					<TableHead class="min-w-32">Shipment</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('handledByUser')}
					<TableHead sortBy="handledByUser" class="min-w-40">Handled By</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-44">Notes</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Transactions" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.transactions ?? [] as transaction (transaction.id)}
				<TableCellRow
					class={twMerge(
						// check if note was created within 5 days
						new Date(transaction.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton href={`/billing/transactions/${transaction.id}`}>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('date')}
						<TableCell><TextBlock>{transaction.date.slice(0, 10)}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('transactionType')}
						<TableCell>
							<TextBlock>{transaction.transactionType}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('transactionNumber')}
						<TableCell>
							<TextBlock>{transaction.transactionNumber}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('credits')}
						<TableCell class="text-center font-semibold tabular-nums">
							{transaction.credits.toString().padStart(2, '0')}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('service')}
						<TableCell>
							<ServiceLink service={transaction.service} />
							<ServiceTypeLink serviceType={transaction.serviceType} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('customer')}
						<TableCell>
							<CustomerLink customer={transaction.customer} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('shipment')}
						<TableCell>
							<NameDetailsLink path="/billing/shipments" record={transaction.shipment} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('handledByUser')}
						<TableCell>
							<UserLink user={transaction.handledByUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							{#if transaction.isFromCall}
								<div class="font-semibold text-orange-500">From Call</div>
							{/if}
							<ViewNoteTableCell notes={transaction.notes} />
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
