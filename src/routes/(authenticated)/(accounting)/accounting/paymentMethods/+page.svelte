<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Payment Methods'

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

	import { NewForm, ConfirmForm, TextEditForm, ToggleEditForm } from '$sveltewind/components/forms'
	import { TextInput, ToggleInput } from '$sveltewind/components/inputs'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { PlusIcon, TrashIcon } from '$sveltewind/icons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	let { data } = $props()

	const countColumns = data.paymentMethods[0]
		? Object.keys(data.paymentMethods[0]._count).reduce((acc: Record<string, string>, curr) => {
				acc[curr] = curr.replaceAll(/(?<!^)(?=[A-Z])/g, ' ')
				acc[curr] = acc[curr].charAt(0).toUpperCase() + acc[curr].slice(1)
				return acc
			}, {})
		: {}
	$effect(() => {
		columnsState.set('paymentMethods', {
			name: 'Name',
			details: 'Details',
			isCard: 'Is Card',
			...countColumns,
			updatedAt: 'Updated At',
			createdAt: 'Created At'
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
							label="New Payment Method"
							action="/accounting/paymentMethods/new"
							successMessage="Successfully created new Payment Method."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) => p.app === 'ACCOUNTING' && p.permissionType === 'ADD_PAYMENT_METHOD'
										)
									)}
								>
									<PlusIcon class="mr-1 size-4" />
									New
								</SolidButton>
							{/snippet}
							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<TextInput isRequired name="name" label="Name" />
									<TextInput name="details" label="Details" />
									<ToggleInput name="isCard" label="Is Card" />
								</div>
							{/snippet}
						</NewForm>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('name')}
					<TableHead sortBy="name" class="min-w-60">Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead sortBy="details" class="min-w-60">Details</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('isCard')}
					<TableHead sortBy="isCard" class="min-w-40 text-center">Is Card</TableHead>
				{/if}
				{#each Object.keys(countColumns) as column (column)}
					{#if columnsState.visibleColumns.includes(column)}
						<TableHead sortBy={column} class="min-w-40">{countColumns[column]}</TableHead>
					{/if}
				{/each}
				{#if columnsState.visibleColumns.includes('updatedAt')}
					<TableHead sortBy="updatedAt" class="min-w-44">Updated At</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('createdAt')}
					<TableHead sortBy="createdAt" class="min-w-44">Created At</TableHead>
				{/if}
				{#if !printerState.isPrinting}
					<TableHead class="min-w-0">
						<div class="flex items-center justify-center">
							<TableColumnsToggle />
							<TablePrint name="Payment Methods" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.paymentMethods ?? [] as paymentMethod (paymentMethod.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Payment Method"
								action={`/accounting/paymentMethods/${paymentMethod.id}?/delete`}
								successMessage="Successfully deleted Payment Method."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) =>
													p.app === 'ACCOUNTING' && p.permissionType === 'DELETE_PAYMENT_METHOD'
											)
										)}
										{onclick}
										--color-ghostButton="var(--color-red-600)"
										class="p-2 text-xs"
									>
										<TrashIcon class="mr-1 size-4" />
										<span>Delete</span>
									</GhostButton>
								{/snippet}
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to delete this Payment Method?</p>
								{/snippet}
							</ConfirmForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('name')}
						<TableCell class="py-1">
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_PAYMENT_METHOD_NAME'
									)
								)}
								isRequired
								name="name"
								value={paymentMethod.name}
								action={`/accounting/paymentMethods/${paymentMethod.id}?/updatePaymentMethodName`}
								successMessage="Successfully updated Name."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('details')}
						<TableCell>
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_PAYMENT_METHOD_DETAILS'
									)
								)}
								name="details"
								value={paymentMethod.details}
								action={`/accounting/paymentMethods/${paymentMethod.id}?/updatePaymentMethodDetails`}
								successMessage="Successfully updated details."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('isCard')}
						<TableCell>
							<ToggleEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_PAYMENT_METHOD_IS_CARD'
									)
								)}
								name="isCard"
								value={paymentMethod.isCard}
								action={`/accounting/paymentMethods/${paymentMethod.id}?/updatePaymentMethodIsCard`}
								successMessage="Successfully updated isCard."
								classForm="ring-0 text-center"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#each Object.keys(countColumns) as column (column)}
						{#if columnsState.visibleColumns.includes(column)}
							<TableCell class="tabular-nums">
								<TextBlock class="justify-center font-semibold">
									{Intl.NumberFormat().format(paymentMethod._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(paymentMethod.updatedAt).toLocaleString('en-CA', {
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
					{#if columnsState.visibleColumns.includes('createdAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(paymentMethod.createdAt).toLocaleString('en-CA', {
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
