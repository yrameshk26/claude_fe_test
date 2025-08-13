<script lang="ts" module>
	type Props = {
		key: string
		data: App.PageData & {
			[key: string]: any
		}
		customerID?: string
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
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { PlusIcon, EditIcon } from '$sveltewind/icons'

	import ServiceTopup from '$routes/(authenticated)/(billing)/billing/services/_components/ServiceTopup.svelte'
	import ServiceCredits from '$routes/(authenticated)/(billing)/billing/services/_components/ServiceCredits.svelte'

	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import ServiceTypeUrlLink from '$lib/components/links/ServiceTypeUrlLink.svelte'
	import CustomerLink from '$lib/components/links/CustomerLink.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import { twMerge } from 'tailwind-merge'

	let { key, data, customerID }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			createdDate: 'Date',
			macIDAccountNumber: 'MAC / Acc No.',
			customer: 'Customer',
			serviceType: 'Service Type',
			topup: 'Topup',
			expiryDate: 'Expiry',
			credits: 'Credits',
			actualExpiryDate: 'Actual Expiry',
			info: 'Info',
			notes: 'Notes'
		})
	})

	const getDaysDifferentFromToday = (date?: string) => {
		if (!date) return 0
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const serviceDate = new Date(date + 'T23:59:59')
		const days = Math.ceil((serviceDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
		return days
	}
</script>

{#snippet creditsSnippet(credits: number)}
	<span
		class={twMerge(
			'inline-flex w-fit items-center rounded-md p-2 font-bold tabular-nums',
			credits > 5 && 'bg-green-200',
			credits <= 5 && credits > 2 && 'bg-yellow-200',
			credits <= 2 && 'bg-red-200'
		)}
	>
		{credits.toString().padStart(2, '0')}
	</span>
{/snippet}

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
					<TableHead class="min-w-0">
						<SolidButton
							isDisabled={!(
								data.session.isAdmin ||
								data.session.permissions.find(
									(p) => p.app === 'BILLING' && p.permissionType === 'ADD_SERVICE'
								)
							)}
							href={customerID
								? `/billing/services/new?customerID=${customerID}`
								: '/billing/services/new'}
							class="text-xs"
						>
							<PlusIcon class="size-4" /> New
						</SolidButton>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('createdDate')}
					<TableHead sortBy="createdDate" class="min-w-32">Date</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('macIDAccountNumber')}
					<TableHead class="min-w-36">MAC / Acc No.</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('customer')}
					<TableHead sortBy="customer" class="min-w-44">Customer</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('serviceType')}
					<TableHead sortBy="serviceType" class="min-w-40">Service Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('topup') && !printerState.isPrinting}
					<TableHead class="min-w-24">Topup</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('expiryDate')}
					<TableHead sortBy="expiryDate" class="min-w-32">Expiry</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('credits') && !printerState.isPrinting}
					<TableHead sortBy="credits" class="min-w-24">Credits</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('actualExpiryDate')}
					<TableHead class="min-w-32">Actual Expiry</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('info')}
					<TableHead class="min-w-28 text-center">Info</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-52">Notes</TableHead>
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
			{#each data.services ?? [] as service (service.id)}
				<TableCellRow
					class={twMerge(
						service.putOnHold && 'bg-slate-200 hover:bg-slate-300',
						service.inactive && 'bg-red-100 hover:bg-red-200',
						service.isTrial && 'bg-orange-100 hover:bg-orange-200',
						getDaysDifferentFromToday(service.expiryDate?.slice(0, 10)) <= 0 &&
							'bg-red-100 hover:bg-red-200',
						getDaysDifferentFromToday(service.expiryDate?.slice(0, 10)) <= 2 &&
							'bg-orange-100 hover:bg-orange-200',
						// check if note was created within 5 days
						new Date(service.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton
								href={`/billing/services/${service.id}`}
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_SERVICES'
									)
								)}
							>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('createdDate')}
						<TableCell><TextBlock>{service.createdDate.slice(0, 10)}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('macIDAccountNumber')}
						<TableCell>
							{#if service.macID}
								<TextBlock>{service.macID}</TextBlock>
							{/if}
							{#if service.accountNumber}
								<TextBlock>{service.accountNumber}</TextBlock>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('customer')}
						<TableCell>
							<CustomerLink customer={service.customer} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('serviceType')}
						<TableCell>
							<ServiceTypeLink serviceType={service.serviceType} />
							<ServiceTypeUrlLink serviceTypeUrl={service.serviceTypeUrl} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('topup') && !printerState.isPrinting}
						<TableCell>
							<ServiceTopup {service} isInline />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('expiryDate')}
						<TableCell>
							{#if service.expiryDate}
								<TextBlock class="">{service.expiryDate.slice(0, 10)}</TextBlock>
								{#if getDaysDifferentFromToday(service.expiryDate.slice(0, 10)) <= 0}
									<div class=" text-red-500">
										{-getDaysDifferentFromToday(service.expiryDate.slice(0, 10))} days ago
									</div>
								{:else if getDaysDifferentFromToday(service.expiryDate.slice(0, 10)) <= 2}
									<div class=" text-orange-500">
										{getDaysDifferentFromToday(service.expiryDate.slice(0, 10))} days left
									</div>
								{:else}
									<div class=" text-green-500">
										{getDaysDifferentFromToday(service.expiryDate.slice(0, 10))} days left
									</div>
								{/if}
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('credits') && !printerState.isPrinting}
						<TableCell class="text-center">
							<ServiceCredits {service} isInline>
								{@render creditsSnippet(service.credits)}
							</ServiceCredits>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('actualExpiryDate')}
						<TableCell>
							{#if service.actualExpiryDate}
								<TextBlock class="">{service.actualExpiryDate.slice(0, 10)}</TextBlock>
								{#if getDaysDifferentFromToday(service.actualExpiryDate.slice(0, 10)) <= 0}
									<div class="text-red-500">
										{-getDaysDifferentFromToday(service.actualExpiryDate.slice(0, 10))} days ago
									</div>
								{:else}
									<div class="text-green-500">
										{getDaysDifferentFromToday(service.actualExpiryDate.slice(0, 10))} days left
									</div>
								{/if}
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('info')}
						<TableCell>
							{#if service.putOnHold}
								<div class="text-center font-semibold text-slate-900">
									{#if service.onHoldDate}
										<div>On Hold</div>
										{service.onHoldDate.slice(0, 10)}
									{:else}
										On Hold
									{/if}
								</div>
							{:else if service.inactive}
								<div class="text-center font-semibold text-red-500">Inactive</div>
							{:else if service.isTrial}
								<div class="text-center font-semibold text-orange-500">Trial</div>
							{:else if getDaysDifferentFromToday(service.expiryDate?.slice(0, 10)) <= 0}
								<div class="text-center font-semibold text-red-500">Expired</div>
							{:else}
								<div class="text-center text-green-700">Active</div>
							{/if}
							{#if service.isSwitched}
								<div class="text-center font-semibold text-slate-900">Switched</div>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							{#if service.isFromCall}
								<div class="font-semibold text-orange-500">From Call</div>
							{/if}
							<ViewNoteTableCell notes={service.notes} />
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
