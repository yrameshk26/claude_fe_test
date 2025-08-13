<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Staffs'

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

	import NewTicket from '$lib/components/forms/NewTicket.svelte'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	let { data } = $props()

	$effect(() => {
		columnsState.set('users', {
			fullName: 'Full Name',
			email: 'Email',
			primaryPhoneNumber: 'Phone Number',
			isAdmin: 'Is Admin',
			permissions: 'Permissions',
			requestedLoginApprovals: 'Login Approvals',
			tickets: 'Tickets'
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
						<SolidButton
							href="/management/staffs/new"
							isDisabled={!(
								data.session.isAdmin ||
								data.session.permissions.find(
									(p) => p.app === 'MANAGEMENT' && p.permissionType === 'ADD_STAFF'
								)
							)}
						>
							<PlusIcon class="size-4" /> New
						</SolidButton>
					</TableHead>
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
				{#if columnsState.visibleColumns.includes('isAdmin')}
					<TableHead sortBy="isAdmin" class="min-w-32">Is Admin</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('permissions')}
					<TableHead sortBy="permissions" class="min-w-36">Permissions</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('requestedLoginApprovals')}
					<TableHead sortBy="requestedLoginApprovals" class="min-w-40">Login Approvals</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('tickets')}
					<TableHead sortBy="assignedToTickets" class="min-w-28">Tickets</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Staffs" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.users ?? [] as user (user.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton
								href={`/management/staffs/${user.id}`}
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'MANAGEMENT' && p.permissionType === 'VIEW_STAFFS'
									)
								)}
							>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('fullName')}
						<TableCell><TextBlock>{user.fullName}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('email')}
						<TableCell><TextBlock>{user.email || '-'}</TextBlock></TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('primaryPhoneNumber')}
						<TableCell>
							{#if user.phoneNumbers?.[0]}
								<TextBlock>{user.phoneNumbers[0].value}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('isAdmin')}
						<TableCell class="text-center">
							{#if user.isAdmin}
								<span class="font-normal text-green-700">Yes</span>
							{:else}
								<span class="font-normal text-red-700">No</span>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('permissions')}
						<TableCell>
							{#if user.isAdmin}
								<span class="font-normal text-green-700">FULL ACCESS</span>
							{:else}
								<TextBlock
									class="text-xs font-normal tabular-nums"
									href={`/management/staffs/${user.id}/permissions`}
									hideCopy
									>{user._count.permissions.toString().padStart(2, '0')} Permissions
								</TextBlock>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('requestedLoginApprovals')}
						<TableCell>
							<TextBlock
								class="text-xs font-normal tabular-nums"
								href={`/management/staffs/${user.id}/loginApprovals`}
								hideCopy
								>{user._count.requestedLoginApprovals.toString().padStart(2, '0')} Login Approvals
							</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('tickets')}
						<TableCell>
							<div class="flex items-center gap-2">
								<TextBlock
									class="text-xs font-normal tabular-nums"
									href={`/management/staffs/${user.id}/tickets?status=OPEN`}
									hideCopy
									>{user._count.assignedToTickets?.toString().padStart(2, '0')} Tickets
								</TextBlock>
								{#if !printerState.isPrinting}
									<NewTicket isInline hideCustomer hideDailyReportLog userID={user.id} />
								{/if}
							</div>
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
