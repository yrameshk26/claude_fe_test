<script lang="ts" module>
	type Props = {
		key: string
		model: 'Reseller' | 'Vendor'
		viewPath: string
		permissionType: 'VENDOR' | 'RESELLER'
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
	import { GhostButton, SolidButton } from '$sveltewind/components/buttons'
	import { EditIcon, PlusIcon } from '$sveltewind/icons'
	import { TextInput } from '$sveltewind/components/inputs'
	import { NewForm } from '$sveltewind/components/forms'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	let { key, model, viewPath, permissionType, data }: Props = $props()

	$effect(() => {
		columnsState.set(key, {
			name: 'Name',
			email: 'Email',
			phoneNo: 'Phone No.',
			address: 'Address',
			details: 'Details',
			products: 'Products'
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
						<NewForm
							label="Create a new {model}"
							action={`${viewPath}/new`}
							successMessage="Successfully created a new {model}."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) => p.app === 'WHOLESALE' && p.permissionType === `ADD_${permissionType}`
										)
									)}
								>
									<PlusIcon class="mr-1 size-4" />
									New
								</SolidButton>
							{/snippet}
							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<TextInput autofocus isRequired name="name" label="Name" />
									<TextInput
										isRequired
										name="phoneNo"
										label="Phone Number"
										maskitoOptions={{
											mask: ['+', '1', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
										}}
									/>
								</div>
							{/snippet}
						</NewForm>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('name')}
					<TableHead sortBy="name" class="min-w-40">Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('email')}
					<TableHead sortBy="email" class="min-w-40">Email</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('phoneNo')}
					<TableHead sortBy="phoneNo" class="min-w-40">Phone No.</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('address')}
					<TableHead class="min-w-60">Address</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead class="min-w-60">Details</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('products')}
					<TableHead sortBy="products" class="min-w-28">Products</TableHead>
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
			{#each data.wholesalers ?? [] as wholesaler (wholesaler.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<GhostButton
								href={`${viewPath}/${wholesaler.id}`}
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'WHOLESALE' && p.permissionType === `VIEW_${permissionType}S`
									)
								)}
							>
								<EditIcon class="size-4" />
							</GhostButton>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('name')}
						<TableCell>
							<TextBlock>{wholesaler.name}</TextBlock>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('email')}
						<TableCell>
							{#if wholesaler.email}
								<TextBlock>{wholesaler.email}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('phoneNo')}
						<TableCell>
							{#if wholesaler.phoneNo}
								<TextBlock>{wholesaler.phoneNo}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('address')}
						<TableCell>
							{#if wholesaler.address}
								<TextBlock>{wholesaler.address}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('details')}
						<TableCell>
							{#if wholesaler.details}
								<TextBlock>{wholesaler.details}</TextBlock>
							{:else}
								-
							{/if}
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('products')}
						<TableCell>
							<TextBlock
								class="text-xs font-normal tabular-nums"
								href={`${viewPath}/${wholesaler.id}/products`}
								hideCopy
								>{wholesaler._count.products.toString().padStart(2, '0')} Products
							</TextBlock>
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
