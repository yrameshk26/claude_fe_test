<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Customers'

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

	import NewCustomerMenu from './_components/NewCustomerMenu.svelte'
	import NewTicket from '$lib/components/forms/NewTicket.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'
	import { twMerge } from 'tailwind-merge'

	let { data } = $props()

	$effect(() => {
		columnsState.set('customers', {
			joinedDate: 'Joined Date',
			fullName: 'Full Name',
			email: 'Email',
			primaryPhoneNumber: 'Phone Number',
			services: 'Services',
			transactions: 'Transactions',
			tickets: 'Tickets',
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

	<Table classContainer="pb-4 lg:h-[calc(100%-96px)] h-[calc(100%-216px)]">
		{#snippet tableHead()}
			<TableHeadRow>
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center gap-0.5">
							<SolidButton
								href="/billing/customers/new"
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'ADD_CUSTOMER'
									)
								)}
							>
								<PlusIcon class="size-4" /> New
							</SolidButton>
							<NewCustomerMenu />
						</div>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('joinedDate')}
					<TableHead sortBy="joinedDate" class="min-w-32">Date</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('fullName')}
					<TableHead sortBy="fullName" class="min-w-44">Full Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('email')}
					<TableHead sortBy="email" class="min-w-48">Email</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('primaryPhoneNumber')}
					<TableHead class="min-w-32">Phone Number</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('services')}
					<TableHead sortBy="services" class="min-w-32">Services</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('transactions')}
					<TableHead sortBy="transactions" class="min-w-36 ">Transactions</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('tickets')}
					<TableHead sortBy="tickets" class="min-w-28">Tickets</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-44">Notes</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Customers" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.customers ?? [] as customer (customer.id)}
				<TableCellRow
					class={twMerge(
						// check if note was created within 5 days
						new Date(customer.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton href={`/billing/customers/${customer.id}`}>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('joinedDate')}
						<TableCell><TextBlock>{customer.joinedDate.slice(0, 10)}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('fullName')}
						<TableCell><TextBlock>{customer.fullName}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('email')}
						<TableCell><TextBlock>{customer.email || '-'}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('primaryPhoneNumber')}
						<TableCell>
							{#if customer.phoneNumbers?.[0]}
								<TextBlock>{customer.phoneNumbers[0].value}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('services')}
						<TableCell>
							<div class="flex items-center gap-2">
								<TextBlock
									class="text-xs font-normal tabular-nums"
									href={`/billing/customers/${customer.id}/services`}
									hideCopy
									>{customer._count.services.toString().padStart(2, '0')} Services
								</TextBlock>
								{#if !printerState.isPrinting}
									<GhostButton
										class="p-1"
										href={`/billing/services/new?customerID=${customer.id}`}
										--color-ghostButton="var(--color-blue-700)"
										><PlusIcon class="size-4" />
									</GhostButton>
								{/if}
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('transactions')}
						<TableCell>
							<TextBlock
								class="text-xs font-normal tabular-nums"
								href={`/billing/customers/${customer.id}/transactions`}
								hideCopy
								>{customer._count.transactions.toString().padStart(2, '0')} Transactions
							</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('tickets')}
						<TableCell>
							<div class="flex items-center gap-2">
								<TextBlock
									class="text-xs font-normal tabular-nums"
									href={`/billing/customers/${customer.id}/tickets?status=OPEN`}
									hideCopy
									>{customer._count.tickets.toString().padStart(2, '0')} Tickets
								</TextBlock>
								{#if !printerState.isPrinting}
									<NewTicket isInline customerID={customer.id} />
								{/if}
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							{#if customer.isFromCall}
								<div class="font-semibold text-orange-500">From Call</div>
							{/if}
							<ViewNoteTableCell notes={customer.notes} />
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
