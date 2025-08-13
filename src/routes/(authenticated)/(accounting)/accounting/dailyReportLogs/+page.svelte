<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Daily Report Logs'

	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'
	import ViewDuplicateDailyReportLogs from '$lib/components/views/ViewDuplicateDailyReportLogs.svelte'
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
	import { PlusIcon, EditIcon, CheckIcon } from '$sveltewind/icons'

	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import UserLink from '$lib/components/links/UserLink.svelte'
	import NewTicket from '$lib/components/forms/NewTicket.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'
	import ConfirmForm from '$sveltewind/components/forms/ConfirmForm.svelte'
	import { untrack } from 'svelte'

	let { data } = $props()

	$effect(() => {
		columnsState.set('dailyReportLogs', {
			processedDate: 'Date',
			number: 'Number',
			transactionType: 'Type',
			company: 'Company',
			payments: 'Payments',
			verifications: 'Verified By',
			salesPerson: 'Sales Person',
			tickets: 'Tickets',
			notes: 'Notes'
		})
	})

	$effect(() => {
		untrack(() => {
			if (
				!data.session.isAdmin ||
				!data.session.permissions.find(
					(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_VERIFY_PAYMENTS'
				)
			) {
				columnsState.alwaysHiddenColumns = ['verifications']
			} else {
				columnsState.alwaysHiddenColumns = []
			}
		})
	})

	const transactionTypes = [
		{
			name: 'Sales',
			type: 'SALES',
			activeClasses: 'bg-green-500 hover:bg-green-600 text-white focus-visible:bg-green-600'
		},
		{
			name: 'Receiving Payment',
			type: 'RECEIVING_PAYMENT',
			activeClasses: 'bg-yellow-500 hover:bg-yellow-600 text-white focus-visible:bg-yellow-600'
		},
		{
			name: 'Credit Memo',
			type: 'CREDIT_MEMO',
			activeClasses: 'bg-red-500 hover:bg-red-600 text-white focus-visible:bg-red-600'
		}
	]
</script>

{#snippet amountSnippet({ amount }: { amount: number })}
	<div
		class={twMerge(
			'px-1 break-keep tabular-nums',
			amount > 0 && 'bg-green-50 text-green-700',
			amount < 0 && 'bg-red-50 text-red-700',
			amount == 0 && 'bg-gray-100 text-gray-700'
		)}
	>
		{Intl.NumberFormat('en', {
			style: 'currency',
			currency: 'USD',
			currencyDisplay: 'symbol'
		}).format(amount)}
	</div>
{/snippet}

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	{#if data.searchTerms}
		<Search terms={data.searchTerms}>
			{#snippet leftChildren()}
				<div
					class="flex w-fit min-w-[27rem] items-center gap-1 overflow-x-auto overflow-y-hidden rounded-md bg-gray-100 p-1"
				>
					{#each transactionTypes as transactionType (transactionType.name)}
						{@const isActive = page.url.searchParams.get('type') === transactionType.type}
						<GhostButton
							onclick={() => {
								const searchParams = new URLSearchParams(page.url.searchParams.toString())
								searchParams.set('type', transactionType.type)
								goto(`?${searchParams.toString()}`, { replaceState: true })
							}}
							--color-ghostButton="var(--color-blue-500)"
							class={twMerge(
								'py-1.5 text-xs text-nowrap',
								isActive && transactionType.activeClasses
							)}
						>
							<span>{transactionType.name.replaceAll('_', ' ')}</span>
						</GhostButton>
					{/each}
					<ViewDuplicateDailyReportLogs />
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

	<Table classContainer="pb-4 lg:h-[calc(100%-96px)] h-[calc(100%-216px)]">
		{#snippet tableHead()}
			<TableHeadRow>
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<SolidButton
							href="/accounting/dailyReportLogs/new"
							isDisabled={!(
								data.session.isAdmin ||
								data.session.permissions.find(
									(p) => p.app === 'ACCOUNTING' && p.permissionType === 'ADD_DAILY_REPORT_LOG'
								)
							)}
						>
							<PlusIcon class="size-4" /> New
						</SolidButton>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('processedDate')}
					<TableHead sortBy="processedDate" class="min-w-32">Date</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('number')}
					<TableHead sortBy="number" class="min-w-36">Number</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('transactionType') && !page.url.searchParams.get('type')}
					<TableHead sortBy="transactionType" class="min-w-36">Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('company')}
					<TableHead sortBy="company" class="min-w-44">Company</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('payments')}
					<TableHead sortBy="totalAmount" class="min-w-72">
						<div class="flex items-center justify-between pr-6">
							<div>Payments</div>
							{#if data.totalAmount}
								{@render amountSnippet({ amount: data.totalAmount })}
							{/if}
						</div>
					</TableHead>
				{/if}
				{#if data.session.isAdmin || (!!data.session.permissions.find((p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_VERIFY_PAYMENTS') && columnsState.visibleColumns.includes('verifications'))}
					<TableHead class="min-w-44">Verified By</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('salesPerson')}
					<TableHead sortBy="salesPerson" class="min-w-44">Sales Person</TableHead>
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
							<TablePrint name="Daily Report Logs" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.dailyReportLogs ?? [] as dailyReportLog (dailyReportLog.id)}
				<TableCellRow
					class={twMerge(
						dailyReportLog.needVerification && 'bg-orange-100 hover:bg-orange-200',
						// check if note was created within 5 days
						new Date(dailyReportLog.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton
								href={`/accounting/dailyReportLogs/${dailyReportLog.id}`}
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_DAILY_REPORT_LOGS'
									)
								)}
							>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('processedDate')}
						<TableCell><TextBlock>{dailyReportLog.processedDate.slice(0, 10)}</TextBlock></TableCell
						>
					{/if}
					{#if columnsState.visibleColumns.includes('number')}
						<TableCell>
							{#if dailyReportLog.transactionNo}
								<div class="flex items-center gap-2">
									Tran: <TextBlock>{dailyReportLog.transactionNo}</TextBlock>
								</div>
							{/if}
							{#if dailyReportLog.refundReceiptNo}
								<div class="flex items-center gap-2">
									Refn: <TextBlock>{dailyReportLog.refundReceiptNo}</TextBlock>
								</div>
							{/if}
							{#if dailyReportLog.receivingPaymentNo}
								<div class="flex items-center gap-2">
									Recv: <TextBlock>{dailyReportLog.receivingPaymentNo}</TextBlock>
								</div>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('transactionType') && !page.url.searchParams.get('type')}
						<TableCell>
							{#if dailyReportLog.transactionType}
								<TextBlock>
									{dailyReportLog.transactionType.replaceAll('_', ' ')}
								</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('company')}
						<TableCell>
							<NameDetailsLink path="/accounting/companies" record={dailyReportLog.company} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('payments')}
						<TableCell>
							{#if dailyReportLog.payments.length > 1}
								<div class="flex flex-col gap-0.5 pb-2 text-xs">
									{#each dailyReportLog.payments as payment (payment.id)}
										<div class="flex justify-between">
											<TextBlock
												>{payment.paymentMethod.name}
												{#if payment.terminal}
													<span class="text-[0.5rem] italic">({payment.terminal.name})</span>
												{/if}
											</TextBlock>
											{@render amountSnippet({ amount: payment.amount })}
										</div>
									{/each}
								</div>
							{/if}
							<div class="inline-flex w-full items-center justify-between text-xs font-medium">
								{#if dailyReportLog.payments.length === 1}
									<TextBlock
										>{dailyReportLog.payments[0].paymentMethod.name}
										{#if dailyReportLog.payments[0].terminal}
											<span class="text-[0.5rem] italic"
												>({dailyReportLog.payments[0].terminal.name})</span
											>
										{/if}
									</TextBlock>
								{:else}
									&nbsp;
								{/if}
								{@render amountSnippet({ amount: dailyReportLog.totalAmount })}
							</div>
						</TableCell>
					{/if}
					{#if data.session.isAdmin || (!!data.session.permissions.find((p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_VERIFY_PAYMENTS') && columnsState.visibleColumns.includes('verifications'))}
						<TableCell>
							<div class="flex flex-col justify-center gap-1 text-center">
								{#each dailyReportLog.verifications as verification (verification.id)}
									<UserLink user={verification.user} />
								{/each}
								{#if !dailyReportLog.verifications.find(({ userID }: { userID: string }) => page.data.session.id === userID)}
									<ConfirmForm
										label="Verify Daily Report Log"
										action={`/accounting/dailyReportLogs/${dailyReportLog.id}?/verifyDailyReportLog`}
										successMessage="Successfully deleted login approval."
									>
										{#snippet trigger({ onclick })}
											<GhostButton
												class="w-fit px-1 py-1 text-xs"
												{onclick}
												--color-ghostButton="var(--color-blue-600)"
											>
												<CheckIcon class="mr-1 size-4" />
												<span>Verify</span>
											</GhostButton>
										{/snippet}
										{#snippet fields()}
											<p class="text-sm">Are you sure you want to verify this daily report log?</p>
										{/snippet}
									</ConfirmForm>
								{/if}
							</div>
							{#if dailyReportLog.needVerification}
								<div class="pt-1 text-center font-semibold text-orange-500">Needs Verification</div>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('salesPerson')}
						<TableCell>
							<UserLink user={dailyReportLog.salesPerson} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('tickets')}
						<TableCell>
							<div class="flex items-center gap-2">
								<TextBlock
									class="text-xs font-normal tabular-nums"
									href={`/accounting/dailyReportLogs/${dailyReportLog.id}/tickets?status=OPEN`}
									hideCopy
									>{dailyReportLog._count.tickets.toString().padStart(2, '0')} Tickets
								</TextBlock>
								{#if !printerState.isPrinting}
									<NewTicket isInline dailyReportLogID={dailyReportLog.id} />
								{/if}
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							<ViewNoteTableCell notes={dailyReportLog.notes} />
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
