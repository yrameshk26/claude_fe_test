<script lang="ts" module>
	type Props = {
		key: string
		data: App.PageData & {
			[key: string]: any
		}
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

	import NewWarrantyClaim from '$lib/components/forms/NewWarrantyClaim.svelte'
	import ProductLink from '$lib/components/links/ProductLink.svelte'
	import UserLink from '$lib/components/links/UserLink.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'

	let { key, data }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			returnedDate: 'Returned Date',
			product: 'Product',
			status: 'Status',
			createdByUser: 'Created By',
			notes: 'Notes'
		})
	})

	const links = [
		{
			name: 'PENDING',
			status: 'PENDING',
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
					<TableHead class="min-w-0">
						<NewWarrantyClaim />
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('returnedDate')}
					<TableHead sortBy="returnedDate" class="min-w-44">Returned Date</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('product')}
					<TableHead class="min-w-40">Product</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('status') && !page.url.searchParams.get('status')}
					<TableHead sortBy="status" class="min-w-36">Status</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('createdByUser')}
					<TableHead sortBy="createdByUser" class="min-w-48">Created By</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-96">Notes</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Warranty Claims" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.warrantyClaims ?? [] as warrantyClaim (warrantyClaim.id)}
				<TableCellRow
					class={twMerge(
						warrantyClaim.status !== 'RESOLVED' &&
							new Date(warrantyClaim.expiresAt) < new Date() &&
							'bg-red-100 hover:bg-red-200',
						// check if note was created within 5 days
						new Date(warrantyClaim.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton
								href={`/wholesale/warrantyClaims/${warrantyClaim.id}`}
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'WHOLESALE' && p.permissionType === 'VIEW_WARRANTY_CLAIMS'
									)
								)}
							>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('returnedDate')}
						<TableCell class="tabular-nums">
							<TextBlock>{warrantyClaim.returnedDate.slice(0, 10)}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('product')}
						<TableCell>
							<ProductLink product={warrantyClaim.product} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('status') && !page.url.searchParams.get('status')}
						<TableCell>
							<div class="flex items-center gap-2 pt-1">
								<div
									class={twMerge(
										'inline-block h-4 w-4 rounded-full',
										warrantyClaim.status === 'PENDING' && 'bg-yellow-500',
										warrantyClaim.status === 'APPROVED' && 'bg-green-500',
										warrantyClaim.status === 'DENIED' && 'bg-red-500'
									)}
								></div>
								<TextBlock>{warrantyClaim.status.replaceAll('_', ' ')}</TextBlock>
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('createdByUser')}
						<TableCell>
							<UserLink user={warrantyClaim.createdByUser} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							<ViewNoteTableCell notes={warrantyClaim.notes} />
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
