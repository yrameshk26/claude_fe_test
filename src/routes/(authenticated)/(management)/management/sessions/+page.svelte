<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Sessions'

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
	import { TrashIcon } from '$sveltewind/icons'
	import { ConfirmForm } from '$sveltewind/components/forms'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import { twMerge } from 'tailwind-merge'

	import UserLink from '$lib/components/links/UserLink.svelte'

	let { data } = $props()

	$effect(() => {
		columnsState.set('allSessions', {
			createdAt: 'Created At',
			staff: 'Staff',
			expiresAt: 'Expires At',
			fingerprint: 'IP Address',
			city: 'City',
			country: 'Country',
			postal: 'Postal'
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
				{#if columnsState.visibleColumns.includes('createdAt')}
					<TableHead sortBy="createdAt" class="min-w-44">Created At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('staff')}
					<TableHead sortBy="staff" class="min-w-48">Staff</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('expiresAt')}
					<TableHead sortBy="expiresAt" class="min-w-36">Expires At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('fingerprint')}
					<TableHead class="min-w-32">IP Address</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('city')}
					<TableHead sortBy="city" class="min-w-32">City</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('country')}
					<TableHead sortBy="country" class="min-w-32">Country</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('postal')}
					<TableHead sortBy="postal" class="min-w-32">Postal</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Sessions" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.sessions ?? [] as session (session.id)}
				<TableCellRow
					class={twMerge(new Date(session.expiresAt) < new Date() && 'bg-red-100 hover:bg-red-200')}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Session"
								action={`/management/sessions/${session.id}?/deleteSession`}
								successMessage="Successfully deleted session."
							>
								{#snippet trigger({ onclick })}
									<GhostButton class="text-xs" {onclick} --color-ghostButton="var(--color-red-600)">
										<TrashIcon class="size-4" />
										<span class="sr-only">Delete</span>
									</GhostButton>
								{/snippet}
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to delete this session?</p>
								{/snippet}
							</ConfirmForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('createdAt')}
						<TableCell class="tabular-nums">
							<TextBlock
								>{new Date(session.createdAt).toLocaleString('en-CA', {
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
					{#if columnsState.visibleColumns.includes('staff')}
						<TableCell>
							<UserLink user={session.user} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('expiresAt')}
						<TableCell class="tabular-nums">
							<TextBlock
								>{new Date(session.expiresAt).toLocaleString('en-CA', {
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
					{#if columnsState.visibleColumns.includes('fingerprint')}
						<TableCell>
							<TextBlock>{session.fingerprint}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('city')}
						<TableCell>
							<TextBlock>{session.city}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('country')}
						<TableCell>
							<TextBlock>{session.country}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('postal')}
						<TableCell>
							<TextBlock>{session.postal}</TextBlock>
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
