<script lang="ts" module>
	type Props = {
		key: string
		data: App.PageData & {
			[key: string]: any
		}
		viewTicketPath: string
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

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'

	import NewTicket from '$lib/components/forms/NewTicket.svelte'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import UserLink from '$lib/components/links/UserLink.svelte'
	import CustomerLink from '$lib/components/links/CustomerLink.svelte'
	import DailyReportLogLink from '$lib/components/links/DailyReportLogLink.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'

	let { key, data, viewTicketPath }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			createdAt: 'Date',
			subject: 'Subject',
			assignedTo: 'Assigned To',
			status: 'Status',
			assignedBy: 'Assigned By',
			expiresAt: 'Expires At',
			customer: 'Customer',
			dailyReportLog: 'Daily Report Log',
			notes: 'Notes'
		})
	})

	const links = [
		{
			name: 'OPEN',
			status: 'OPEN',
			activeClasses: 'bg-red-500 hover:bg-red-600 text-white focus-visible:bg-red-600'
		},
		{
			name: 'IN_PROGRESS',
			status: 'IN_PROGRESS',
			activeClasses: 'bg-yellow-500 hover:bg-yellow-600 text-white focus-visible:bg-yellow-600'
		},
		{
			name: 'RESOLVED',
			status: 'RESOLVED',
			activeClasses: 'bg-green-500 hover:bg-green-600 text-white focus-visible:bg-green-600'
		}
	]
</script>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	{#if data.searchTerms}
		<Search terms={data.searchTerms}>
			{#snippet leftChildren()}
				<div
					class="flex w-fit min-w-68 items-center gap-1 overflow-x-auto overflow-y-hidden rounded-md bg-gray-100 p-1"
				>
					<GhostButton
						onclick={() => {
							const searchParams = new URLSearchParams(page.url.searchParams.toString())
							searchParams.set('assignedTo', 'me')
							goto(`?${searchParams.toString()}`, { replaceState: true })
						}}
						--color-ghostButton="var(--color-slate-500)"
						class={twMerge(
							'py-1.5 text-xs text-nowrap',
							page.url.searchParams.get('assignedTo') === 'me' &&
								'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
						)}
					>
						My Tickets
					</GhostButton>
					<GhostButton
						isDisabled={!data.canViewAllTickets}
						onclick={() => {
							const searchParams = new URLSearchParams(page.url.searchParams.toString())
							searchParams.set('assignedTo', 'all')
							goto(`?${searchParams.toString()}`, { replaceState: true })
						}}
						--color-ghostButton="var(--color-slate-500)"
						class={twMerge(
							'py-1.5 text-xs text-nowrap',
							page.url.searchParams.get('assignedTo') === 'all' &&
								'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
						)}
					>
						All Tickets
					</GhostButton>
					<GhostButton
						onclick={() => {
							const searchParams = new URLSearchParams(page.url.searchParams.toString())
							searchParams.set('ticketType', 'User')
							goto(`?${searchParams.toString()}`, { replaceState: true })
						}}
						--color-ghostButton="var(--color-slate-500)"
						class={twMerge(
							'py-1.5 text-xs text-nowrap',
							page.url.searchParams.get('ticketType') === 'User' &&
								'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
						)}
					>
						User
					</GhostButton>
					{#if !page.url.pathname.includes('/accounting/tickets')}
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('ticketType', 'Customer')
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-slate-500)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap',
								page.url.searchParams.get('ticketType') === 'Customer' &&
									'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
							)}
						>
							Customer
						</GhostButton>
					{/if}
					{#if !page.url.pathname.includes('/billing/tickets')}
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('ticketType', 'DailyReportLog')
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-slate-500)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap',
								page.url.searchParams.get('ticketType') === 'DailyReportLog' &&
									'bg-slate-500 text-white hover:bg-slate-600 focus-visible:bg-slate-600'
							)}
						>
							Daily Report Log
						</GhostButton>
					{/if}
					{#each links as link (link.name)}
						{@const isActive = page.url.searchParams.get('status') === link.status}
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('status', link.status)
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-blue-500)"
							class={twMerge('py-1.5 text-xs text-nowrap', isActive && link.activeClasses)}
						>
							<span>{link.name.replaceAll('_', ' ')}</span>
						</GhostButton>
					{/each}
				</div>
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
					<TableHead class="min-w-0">
						<NewTicket
							customerID={page.url.pathname.includes('/billing/customers/')
								? page.params.id
								: undefined}
							dailyReportLogID={page.url.pathname.includes('/accounting/dailyReportLogs/')
								? page.params.id
								: undefined}
							userID={page.url.pathname.includes('/management/staffs/')
								? page.params.id
								: undefined}
							hideCustomer={page.url.pathname.includes('/accounting/') ||
								page.url.pathname.includes('/management/')}
							hideDailyReportLog={page.url.pathname.includes('/billing/') ||
								page.url.pathname.includes('/accounting/')}
						/>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('createdAt')}
					<TableHead sortBy="createdAt" class="min-w-48">Created At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('subject')}
					<TableHead sortBy="subject" class="min-w-40">Subject</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('assignedTo') && page.url.searchParams.get('assignedTo') !== 'me'}
					<TableHead sortBy="assignedTo" class="min-w-48">Assigned To</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('status') && !page.url.searchParams.get('status')}
					<TableHead sortBy="status" class="min-w-32">Status</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('assignedBy')}
					<TableHead sortBy="assignedBy" class="min-w-48">Assigned By</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('expiresAt')}
					<TableHead sortBy="expiresAt" class="min-w-32">Expires At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('customer')}
					<TableHead sortBy="customer" class="min-w-40">Customer</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('dailyReportLog')}
					<TableHead sortBy="dailyReportLog" class="min-w-40">Daily Report Log</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-44">Notes</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Tickets" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.tickets ?? [] as ticket (ticket.id)}
				<TableCellRow
					class={twMerge(
						ticket.status !== 'RESOLVED' &&
							new Date(ticket.expiresAt) < new Date() &&
							'bg-red-100 hover:bg-red-200',
						// check if note was created within 5 days
						new Date(ticket.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton href={`${viewTicketPath}/${ticket.id}`}>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('createdAt')}
						<TableCell class="tabular-nums">
							<TextBlock
								>{new Date(ticket.createdAt).toLocaleString('en-CA', {
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
					{#if columnsState.visibleColumns.includes('subject')}
						<TableCell>
							<NameDetailsLink path="/management/tickets/ticketSubjects" record={ticket.subject} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('assignedTo') && page.url.searchParams.get('assignedTo') !== 'me'}
						<TableCell>
							<UserLink user={ticket.assignedToUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('status') && !page.url.searchParams.get('status')}
						<TableCell>
							<div class="flex items-center gap-2 pt-1">
								<div
									class={twMerge(
										'inline-block h-4 w-4 rounded-full',
										ticket.status === 'OPEN' && 'bg-red-500',
										ticket.status === 'IN_PROGRESS' && 'bg-yellow-500',
										ticket.status === 'RESOLVED' && 'bg-green-500'
									)}
								></div>
								<TextBlock>{ticket.status.replaceAll('_', ' ')}</TextBlock>
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('assignedBy')}
						<TableCell>
							<UserLink user={ticket.assignedByUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('expiresAt')}
						<TableCell class="text-center">
							{#if ticket.status !== 'RESOLVED' && new Date(ticket.expiresAt) < new Date()}
								<div class="text-center text-xs font-bold text-red-500">Expired</div>
							{/if}
							<TextBlock class="-mr-4 justify-center">{ticket.expiresAt.slice(0, 10)}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('customer')}
						<TableCell>
							<CustomerLink customer={ticket.customer} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('dailyReportLog')}
						<TableCell>
							<DailyReportLogLink dailyReportLog={ticket.dailyReportLog} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							<ViewNoteTableCell notes={ticket.notes} />
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
