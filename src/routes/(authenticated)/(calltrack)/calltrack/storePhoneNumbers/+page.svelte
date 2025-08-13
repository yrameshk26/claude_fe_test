<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Store Phone Numbers'

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

	import { NewForm, ConfirmForm, TextEditForm } from '$sveltewind/components/forms'
	import { TextInput } from '$sveltewind/components/inputs'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { PlusIcon, TrashIcon } from '$sveltewind/icons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	let { data } = $props()

	const countColumns = {
		callRecords: 'Call Records'
	}
	$effect(() => {
		columnsState.set('storePhoneNumbers', {
			name: 'Name',
			phoneNo: 'Phone Number',
			details: 'Details',
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
							label="New Store Phone Number"
							action="/calltrack/storePhoneNumbers/new"
							successMessage="Successfully created new Store Phone Number."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) => p.app === 'CALLTRACK' && p.permissionType === 'ADD_STORE_PHONE_NUMBER'
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
									<TextInput
										isRequired
										name="phoneNo"
										label="Phone Number"
										maskitoOptions={{
											mask: ['+', '1', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
										}}
									/>
									<TextInput name="details" label="Details" />
								</div>
							{/snippet}
						</NewForm>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('name')}
					<TableHead sortBy="name" class="min-w-60">Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('phoneNo')}
					<TableHead sortBy="phoneNo" class="min-w-48">Phone Number</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead sortBy="details" class="min-w-60">Details</TableHead>
				{/if}
				{#each Object.keys(countColumns) as column (column)}
					{#if columnsState.visibleColumns.includes(column)}
						<TableHead sortBy={column} class="min-w-40"
							>{countColumns[column as keyof typeof countColumns]}</TableHead
						>
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
							<TablePrint name="Store Phone Numbers" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.storePhoneNumbers ?? [] as storePhoneNumber (storePhoneNumber.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Store Phone Number"
								action={`/calltrack/storePhoneNumbers/${storePhoneNumber.id}?/delete`}
								successMessage="Successfully deleted Store Phone Number."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) =>
													p.app === 'CALLTRACK' && p.permissionType === 'DELETE_STORE_PHONE_NUMBER'
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
									<p class="text-sm">Are you sure you want to delete this Store Phone Number?</p>
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
										(p) =>
											p.app === 'CALLTRACK' && p.permissionType === 'EDIT_STORE_PHONE_NUMBER_NAME'
									)
								)}
								isRequired
								name="name"
								value={storePhoneNumber.name}
								action={`/calltrack/storePhoneNumbers/${storePhoneNumber.id}?/updateStorePhoneNumberName`}
								successMessage="Successfully updated Name."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('phoneNo')}
						<TableCell class="py-1">
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'CALLTRACK' &&
											p.permissionType === 'EDIT_STORE_PHONE_NUMBER_PHONE_NO'
									)
								)}
								isRequired
								name="phoneNo"
								value={storePhoneNumber.phoneNo}
								maskitoOptions={{
									mask: ['+', '1', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
								}}
								action={`/calltrack/storePhoneNumbers/${storePhoneNumber.id}?/updateStorePhoneNumberPhoneNo`}
								successMessage="Successfully updated phone number."
								classForm="ring-0"
								classValue="text-xs tabular-nums"
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
											p.app === 'CALLTRACK' &&
											p.permissionType === 'EDIT_STORE_PHONE_NUMBER_DETAILS'
									)
								)}
								name="details"
								value={storePhoneNumber.details}
								action={`/calltrack/storePhoneNumbers/${storePhoneNumber.id}?/updateStorePhoneNumberDetails`}
								successMessage="Successfully updated details."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#each Object.keys(countColumns) as column (column)}
						{#if columnsState.visibleColumns.includes(column)}
							<TableCell class="tabular-nums">
								<TextBlock class="justify-center font-semibold">
									{Intl.NumberFormat().format(storePhoneNumber._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(storePhoneNumber.updatedAt).toLocaleString('en-CA', {
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
								>{new Date(storePhoneNumber.createdAt).toLocaleString('en-CA', {
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
