<script lang="ts" module>
	type Props = {
		key: string
		data: App.PageData & {
			[key: string]: any
		}
		vendorID?: string
		resellerID?: string
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte'

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
	import { PlusIcon, EditIcon } from '$sveltewind/icons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import WholesalerLink from '$lib/components/links/WholesalerLink.svelte'
	import NewWarrantyClaim from '$lib/components/forms/NewWarrantyClaim.svelte'
	import ViewNoteTableCell from '$lib/components/views/ViewNoteTableCell.svelte'
	import { twMerge } from 'tailwind-merge'

	let { key, data, vendorID, resellerID }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			serialNoMacID: 'Serial No. / MAC ID',
			productType: 'Product Type',
			vendor: 'Vendor',
			reseller: 'Reseller',
			warrantyClaims: 'Warranty Claims',
			notes: 'Notes'
		})
	})

	let newURL = $state('/wholesale/products/new')
	$effect(() => {
		untrack(() => {
			if (vendorID) {
				newURL += `?vendorID=${vendorID}`
			}
			if (resellerID) {
				if (newURL.includes('?')) {
					newURL += `&resellerID=${resellerID}`
				} else {
					newURL += `?resellerID=${resellerID}`
				}
			}
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
					<TableHead class="min-w-0">
						<SolidButton
							href={newURL}
							class="text-xs"
							isDisabled={!(
								data.session.isAdmin ||
								data.session.permissions.find(
									(p) => p.app === 'WHOLESALE' && p.permissionType === 'ADD_PRODUCT'
								)
							)}
						>
							<PlusIcon class="size-4" /> New
						</SolidButton>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('serialNoMacID')}
					<TableHead class="min-w-40">Serial No / MAC ID</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('productType')}
					<TableHead sortBy="productType" class="min-w-40">Product Type</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('vendor')}
					<TableHead sortBy="vendor" class="min-w-60">Vendor</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('reseller')}
					<TableHead sortBy="reseller" class="min-w-60">Reseller</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('warrantyClaims')}
					<TableHead sortBy="warrantyClaims" class="min-w-44">Warranty Claims</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('notes')}
					<TableHead sortBy="notes" class="min-w-60">Notes</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Products" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.products ?? [] as product (product.id)}
				{@const vendorWarrantyExpiresInDays = Math.floor(
					(new Date(product.vendorWarrantyExpiryDt).getTime() - new Date().getTime()) /
						(24 * 60 * 60 * 1000)
				)}
				{@const resellerWarrantyExpiresInDays = product.resellerWarrantyExpiryDt
					? Math.floor(
							(new Date(product.resellerWarrantyExpiryDt).getTime() - new Date().getTime()) /
								(24 * 60 * 60 * 1000)
						)
					: 9999}
				<TableCellRow
					class={twMerge(
						(vendorWarrantyExpiresInDays < 30 || resellerWarrantyExpiresInDays < 30) &&
							'bg-orange-100 hover:bg-orange-200',
						(vendorWarrantyExpiresInDays < 0 || resellerWarrantyExpiresInDays < 0) &&
							'bg-red-100 hover:bg-red-200',
						// check if note was created within 5 days
						new Date(product.notes[0]?.updatedAt).getTime() >=
							new Date().getTime() - 5 * 24 * 60 * 60 * 1000 && 'bg-yellow-100 hover:bg-yellow-200'
					)}
				>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton
								href={`/wholesale/products/${product.id}`}
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'WHOLESALE' && p.permissionType === 'VIEW_PRODUCTS'
									)
								)}
							>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('serialNoMacID')}
						<TableCell>
							<TextBlock>{product.serialNo}</TextBlock>
							{#if product.macID}
								<TextBlock>{product.macID}</TextBlock>
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('productType')}
						<TableCell>
							<NameDetailsLink path="/billing/productTypes" record={product.productType} />
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('vendor')}
						<TableCell class="pb-2">
							<div class="mx-auto pb-2">
								<WholesalerLink path="/wholesale/vendors" record={product.vendor} />
							</div>
							<div class="grid grid-cols-2 items-center gap-0">
								<div>Invoice No:</div>
								<TextBlock class="-my-1 justify-end italic">{product.vendorInvoiceNo}</TextBlock>
								<div>Purchase:</div>
								<TextBlock class="-my-1 justify-end italic"
									>{product.vendorPurchaseDt.slice(0, 10)}</TextBlock
								>
								<div>Warranty Expiry:</div>
								<TextBlock class="-my-1 justify-end italic"
									>{product.vendorWarrantyExpiryDt.slice(0, 10)}</TextBlock
								>
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('reseller')}
						<TableCell>
							<div class="mx-auto pb-2">
								<WholesalerLink path="/wholesale/resellers" record={product.reseller} />
							</div>
							<div class="grid grid-cols-2 items-center gap-0">
								<div>Invoice No:</div>
								<TextBlock class="-my-1 justify-end italic"
									>{product.resellerInvoiceNo || '-'}</TextBlock
								>
								<div>Purchase:</div>
								<TextBlock class="-my-1 justify-end italic"
									>{product.resellerPurchaseDt?.slice(0, 10) || '-'}</TextBlock
								>
								<div>Warranty Expiry:</div>
								<TextBlock class="-my-1 justify-end italic"
									>{product.resellerWarrantyExpiryDt?.slice(0, 10) || '-'}</TextBlock
								>
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('warrantyClaims')}
						<TableCell>
							<div class="flex items-center gap-2">
								<TextBlock
									class="text-xs font-normal tabular-nums"
									href={`/wholesale/products/${product.id}/warrantyClaims`}
									hideCopy
									>{product._count.warrantyClaims.toString().padStart(2, '0')} Warranty Claims
								</TextBlock>
								{#if !printerState.isPrinting}
									<NewWarrantyClaim productID={product.id} />
								{/if}
							</div>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('notes')}
						<TableCell>
							{#if vendorWarrantyExpiresInDays < 0}
								<div class="font-semibold text-red-500">Vendor warranty has expired.</div>
							{:else if vendorWarrantyExpiresInDays < 30}
								<div class="font-semibold text-orange-500">
									Vendor warranty expires in {vendorWarrantyExpiresInDays} days.
								</div>
							{/if}
							{#if resellerWarrantyExpiresInDays < 0}
								<div class="font-semibold text-red-500">Reseller warranty has expired.</div>
							{:else if resellerWarrantyExpiresInDays < 30}
								<div class="font-semibold text-orange-500">
									Reseller warranty expires in {resellerWarrantyExpiresInDays} days.
								</div>
							{/if}
							<ViewNoteTableCell notes={product.notes} />
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
