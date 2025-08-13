<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View Call Records'

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

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'

	import UserLink from '$lib/components/links/UserLink.svelte'
	import EndActiveCall from '$lib/components/forms/EndActiveCall.svelte'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'

	let { data } = $props()

	$effect(() => {
		columnsState.set('callRecords', {
			startTime: 'Start Time',
			endTime: 'End Time',
			duration: 'Duration',
			customerWaitSeconds: 'Wait Time',
			createdBy: 'Staff',
			storePhoneNumber: 'Store Phone',
			callType: 'Call Type',
			customerPhoneNo: 'Customer Phone',
			category: 'Categories',
			serviceType: 'Service Type',
			productType: 'Product Type',
			notes: 'Notes'
		})
	})

	const formatDuration = (seconds: number = 0) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const remainingSeconds = seconds % 60
		return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`
	}
</script>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	{#if data.searchTerms}
		<Search terms={data.searchTerms}>
			{#snippet leftChildren()}
				{#if data.canViewAllCallRecords}
					<div
						class="flex w-fit min-w-60 items-center gap-1 overflow-x-auto overflow-y-hidden rounded-md bg-slate-800 border border-slate-700 p-1"
					>
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('createdBy', 'me')
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-slate-600)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap text-slate-300 hover:text-white',
								page.url.searchParams.get('createdBy') === 'me' &&
									'bg-slate-700 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
							)}
						>
							My Call Records
						</GhostButton>
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('createdBy', 'all')
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-slate-600)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap text-slate-300 hover:text-white',
								page.url.searchParams.get('createdBy') === 'all' &&
									'bg-slate-700 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
							)}
						>
							All Call Records
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
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0"></TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('startTime')}
					<TableHead sortBy="startTime" class="min-w-40">Start Time</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('endTime')}
					<TableHead sortBy="endTime" class="min-w-40">End Time</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('duration')}
					<TableHead sortBy="duration" class="min-w-32">Duration</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('customerWaitSeconds')}
					<TableHead sortBy="customerWaitSeconds" class="min-w-32">Wait Time</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('createdBy') && page.url.searchParams.get('createdBy') !== 'me'}
					<TableHead sortBy="createdBy" class="min-w-44">Staff</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('storePhoneNumber')}
					<TableHead class="min-w-36">Store Phone</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('callType')}
					<TableHead sortBy="callType" class="min-w-36">Call Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('customerPhoneNo')}
					<TableHead sortBy="customerPhoneNo" class="min-w-40">Customer Phone</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('category')}
					<TableHead class="min-w-60">Categories</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('serviceType')}
					<TableHead sortBy="serviceType" class="min-w-36">Service Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('productType')}
					<TableHead sortBy="productType" class="min-w-36">Product Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-44">Notes</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Call Records" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.callRecords ?? [] as callRecord (callRecord.id)}
				<TableCellRow
					class={twMerge(
						callRecord.isNewCustomer && 'bg-orange-900/20 hover:bg-orange-900/30',
						// check if note was created within 5 days
						new Date(callRecord.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-900/20 hover:bg-yellow-900/30'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton href={`/calltrack/callRecords/${callRecord.id}`}>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('startTime')}
						<TableCell class="tabular-nums">
							<TextBlock
								>{new Date(callRecord.startTime).toLocaleString('en-CA', {
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
					{#if columnsState.visibleColumns.includes('endTime')}
						<TableCell class="tabular-nums">
							{#if callRecord.endTime}
								<TextBlock>
									{new Date(callRecord.endTime).toLocaleString('en-CA', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										hour12: false
									})}
								</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('duration')}
						<TableCell class="text-center tabular-nums">
							{#if callRecord.duration}
								<TextBlock class="-mr-4 justify-center">
									{formatDuration(callRecord.duration)}
								</TextBlock>
							{:else}
								<EndActiveCall {callRecord} />
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('customerWaitSeconds')}
						<TableCell class="text-center tabular-nums">
							{#if callRecord.customerWaitSeconds}
								<TextBlock class="w-full justify-center"
									>{formatDuration(callRecord.customerWaitSeconds)}</TextBlock
								>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('createdBy') && page.url.searchParams.get('createdBy') !== 'me'}
						<TableCell>
							<UserLink user={callRecord.createdByUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('storePhoneNumber')}
						<TableCell>
							{#if callRecord.storePhoneNumber}
								<TextBlock>{callRecord.storePhoneNumber.phoneNo}</TextBlock>
								<TextBlock>{callRecord.storePhoneNumber.name}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('callType')}
						<TableCell>
							{#if callRecord.callType}
								<TextBlock>{callRecord.callType}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('customerPhoneNo')}
						<TableCell>
							{#if callRecord.customerPhoneNo}
								<TextBlock>{callRecord.customerPhoneNo}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('category')}
						<TableCell>
							<div class="grid grid-cols-4 items-center justify-between gap-1">
								<div>Service:</div>
								<div class="col-span-3">
									<NameDetailsLink
										path="/calltrack/callCategories/levelOne"
										record={callRecord.callCategoryLevelOne}
										class="w-full justify-end text-right"
									/>
								</div>
								<div>Main:</div>
								<div class="col-span-3">
									<NameDetailsLink
										path="/calltrack/callCategories/levelTwo"
										record={callRecord.callCategoryLevelTwo}
										class="w-full justify-end text-right"
									/>
								</div>
								<div>Sub:</div>
								<div class="col-span-3">
									<NameDetailsLink
										path="/calltrack/callCategories/levelThree"
										record={callRecord.callCategoryLevelThree}
										class="w-full justify-end text-right"
									/>
								</div>
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('serviceType')}
						<TableCell>
							<ServiceTypeLink serviceType={callRecord.serviceType} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('productType')}
						<TableCell>
							<NameDetailsLink path="/billing/productTypes" record={callRecord.productType} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							{#if callRecord.isNewCustomer}
								<div class="font-semibold text-orange-500">New Customer</div>
							{/if}
							<ViewNoteTableCell notes={callRecord.notes} />
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
