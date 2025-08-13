<script lang="ts" module>
	type Props = {
		key: string
		data: App.PageData & {
			[key: string]: any
		}
		alwaysHiddenColumns?: string[]
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
	import { GhostButton, SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon, CheckIcon, XMarkIcon } from '$sveltewind/icons'
	import { ConfirmForm, DateEditForm } from '$sveltewind/components/forms'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'

	import UserLink from '$lib/components/links/UserLink.svelte'

	let { key, data, alwaysHiddenColumns = [] }: Props = $props()

	$effect(() => {
		if (page.url.searchParams.get('status') === 'ACTIVE') {
			columnsState.alwaysHiddenColumns = [
				'expiresAt',
				'processedBy',
				'processedAt',
				...alwaysHiddenColumns
			]
		} else if (page.url.searchParams.get('status') !== '') {
			columnsState.alwaysHiddenColumns = ['requestedTimes', ...alwaysHiddenColumns]
		}
	})

	$effect(() => {
		columnsState.set(key, {
			requestedAt: 'Requested At',
			requestedBy: 'Requested By',
			requestedTimes: 'Req Times',
			details: 'Details',
			status: 'Status',
			expiresAt: 'Expires At',
			processedBy: 'Approved By',
			processedAt: 'Processed At'
		})
	})

	const links = [
		{
			name: 'ACTIVE',
			status: 'ACTIVE',
			activeClasses: 'bg-yellow-500 hover:bg-yellow-600 text-white focus-visible:bg-yellow-600'
		},
		{
			name: 'APPROVED',
			status: 'APPROVED',
			activeClasses: 'bg-green-500 hover:bg-green-600 text-white focus-visible:bg-green-600'
		},
		{
			name: 'DENIED',
			status: 'DENIED',
			activeClasses: 'bg-red-500 hover:bg-red-600 text-white focus-visible:bg-red-600'
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
					<TableHead class="min-w-0"></TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('requestedAt')}
					<TableHead sortBy="requestedAt" class="min-w-48">Requested At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('requestedBy')}
					<TableHead sortBy="requestedBy" class="min-w-48">Requested By</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('requestedTimes') && page.url.searchParams.get('status') === 'ACTIVE'}
					<TableHead sortBy="requestedTimes" class="min-w-32">Req Times</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead sortBy="details" class="min-w-36">Details</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('status') && !page.url.searchParams.get('status')}
					<TableHead sortBy="status" class="min-w-32">Status</TableHead>
				{/if}
				{#if page.url.searchParams.get('status') !== 'ACTIVE'}
					{#if columnsState.visibleColumns.includes('expiresAt')}
						<TableHead sortBy="expiresAt" class="min-w-36">Expires At</TableHead>
					{/if}
					{#if columnsState.visibleColumns.includes('processedBy')}
						<TableHead sortBy="processedBy" class="min-w-48">Processed By</TableHead>
					{/if}
					{#if columnsState.visibleColumns.includes('processedAt')}
						<TableHead sortBy="processedAt" class="min-w-48">Processed At</TableHead>
					{/if}
				{/if}
				{#if page.url.searchParams.get('status') === 'ACTIVE'}
					<TableHead class="min-w-72"></TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Login Approvals" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.loginApprovals ?? [] as loginApproval (loginApproval.id)}
				<TableCellRow
					class={twMerge(
						loginApproval.status !== 'DENIED' &&
							new Date(loginApproval.expiresAt) < new Date() &&
							'bg-red-100 hover:bg-red-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Login Approval"
								action={`/management/loginApprovals/${loginApproval.id}?/deleteLoginApproval`}
								successMessage="Successfully deleted login approval."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) =>
													p.app === 'MANAGEMENT' && p.permissionType === 'DELETE_LOGIN_APPROVAL'
											)
										)}
										class="text-xs"
										{onclick}
										--color-ghostButton="var(--color-red-600)"
									>
										<TrashIcon class="size-4" />
										<span class="sr-only">Delete</span>
									</GhostButton>
								{/snippet}
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to delete this login approval?</p>
								{/snippet}
							</ConfirmForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('requestedAt')}
						<TableCell class="tabular-nums">
							<TextBlock
								>{new Date(loginApproval.requestedAt).toLocaleString('en-CA', {
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
					{#if columnsState.visibleColumns.includes('requestedBy')}
						<TableCell>
							<UserLink user={loginApproval.requestedUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('requestedTimes') && page.url.searchParams.get('status') === 'ACTIVE'}
						<TableCell>
							<div class="text-center font-semibold tabular-nums">
								{loginApproval.requestedTimes.toString().padStart(2, '0')}
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('details')}
						<TableCell class="py-2">
							<code>
								{JSON.stringify(
									{
										ip: loginApproval.fingerprint,
										city: loginApproval.city,
										country: loginApproval.country,
										postal: loginApproval.postal
									},
									null,
									2
								)}
							</code>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('status') && !page.url.searchParams.get('status')}
						<TableCell>
							<div class="flex items-center gap-2 pt-1">
								<div
									class={twMerge(
										'inline-block h-4 w-4 rounded-full',
										loginApproval.status === 'ACTIVE' && 'bg-yellow-500',
										loginApproval.status === 'APPROVED' && 'bg-green-500',
										loginApproval.status === 'DENIED' && 'bg-red-500'
									)}
								></div>
								<TextBlock>{loginApproval.status.replaceAll('_', ' ')}</TextBlock>
							</div>
						</TableCell>
					{/if}
					{#if page.url.searchParams.get('status') === 'ACTIVE'}
						<TableCell class="text-center">
							<div class="flex items-center justify-center gap-1">
								<ConfirmForm
									label="DENY"
									action={`/management/loginApprovals/${loginApproval.id}?/denyLoginApproval`}
									successMessage="Successfully denied login approval."
								>
									{#snippet trigger({ onclick })}
										<SolidButton
											isDisabled={!(
												data.session.isAdmin ||
												data.session.permissions.find(
													(p) =>
														p.app === 'MANAGEMENT' && p.permissionType === 'DENY_LOGIN_APPROVAL'
												)
											)}
											class="text-xs"
											{onclick}
											--color-solidButton="var(--color-red-600)"
										>
											<XMarkIcon class="mr-1" />
											<span>DENY</span>
										</SolidButton>
									{/snippet}
									{#snippet fields()}
										<p class="text-sm">Are you sure you want to deny this login approval?</p>
									{/snippet}
								</ConfirmForm>

								<ConfirmForm
									label="APPROVE"
									action={`/management/loginApprovals/${loginApproval.id}?/approveLoginApproval`}
									successMessage="Successfully approved login approval."
								>
									{#snippet trigger({ onclick })}
										<SolidButton
											isDisabled={!(
												data.session.isAdmin ||
												data.session.permissions.find(
													(p) =>
														p.app === 'MANAGEMENT' && p.permissionType === 'APPROVE_LOGIN_APPROVAL'
												)
											)}
											class="text-xs"
											{onclick}
											--color-solidButton="var(--color-green-600)"
										>
											<CheckIcon class="mr-1" />
											<span>APPROVE</span>
										</SolidButton>
									{/snippet}
									{#snippet fields()}
										<p class="text-sm">Are you sure you want to approve this login approval?</p>
									{/snippet}
								</ConfirmForm>
							</div>
						</TableCell>
					{:else}
						{#if columnsState.visibleColumns.includes('expiresAt')}
							<TableCell>
								{#if loginApproval.status !== 'DENIED' && new Date(loginApproval.expiresAt) < new Date()}
									<div class="text-xs font-bold text-red-500">Expired</div>
								{/if}
								<DateEditForm
									isRequired
									name="expiresAt"
									value={loginApproval.expiresAt}
									action={`/management/loginApprovals/${loginApproval.id}?/updateLoginApprovalExpiryDate`}
									successMessage="Successfully updated login approval expiry date."
								/>
							</TableCell>
						{/if}
						{#if columnsState.visibleColumns.includes('processedBy')}
							<TableCell>
								<UserLink user={loginApproval.processedAdmin} />
							</TableCell>
						{/if}
						{#if columnsState.visibleColumns.includes('processedAt')}
							<TableCell>
								<TextBlock
									>{new Date(loginApproval.approvedAt).toLocaleString('en-CA', {
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
