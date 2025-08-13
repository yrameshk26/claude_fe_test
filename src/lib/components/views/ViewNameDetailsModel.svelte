<script lang="ts" module>
	type Props = {
		key: string

		data: any
		newLabel: string
		isNewDisabled: boolean
		isNameEditDisabled: boolean
		isDetailsEditDisabled: boolean
		isDeleteDisabled: boolean
		newSuccessMessage: string

		newAdditionalFormData: Record<string, any>

		updateNameAdditionalFormData: Record<string, any>

		updateDetailsAdditionalFormData: Record<string, any>
		deleteLabel: string
		deleteSuccessMessage: string

		deleteAdditionalFormData?: Record<string, any>
		sendCustomerMessageAction?: string
		sendCustomerMessageInfo?: string
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

	import { NewForm, ConfirmForm, TextEditForm } from '$sveltewind/components/forms'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { TextInput } from '$sveltewind/components/inputs'
	import { PlusIcon, TrashIcon } from '$sveltewind/icons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	import SendCustomerMessage from '$lib/components/forms/SendCustomerMessage.svelte'

	let {
		key,
		data,
		newLabel,
		isNewDisabled,
		isNameEditDisabled,
		isDetailsEditDisabled,
		isDeleteDisabled,
		newAdditionalFormData,
		newSuccessMessage,
		updateNameAdditionalFormData,
		updateDetailsAdditionalFormData,
		deleteLabel,
		deleteSuccessMessage,
		deleteAdditionalFormData,
		sendCustomerMessageAction,
		sendCustomerMessageInfo
	}: Props = $props()

	const countColumns = data.records[0]
		? Object.keys(data.records[0]._count).reduce((acc: Record<string, string>, curr) => {
				acc[curr] = curr.replaceAll(/(?<!^)(?=[A-Z])/g, ' ')
				acc[curr] = acc[curr].charAt(0).toUpperCase() + acc[curr].slice(1)
				return acc
			}, {})
		: {}

	$effect(() => {
		columnsState.set(key, {
			name: 'Name',
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
							label={newLabel}
							action="/nameDetails/new"
							successMessage={newSuccessMessage}
							additionalFormData={newAdditionalFormData}
						>
							{#snippet trigger({ onclick })}
								<SolidButton {onclick} class="text-xs" isDisabled={isNewDisabled}>
									<PlusIcon class="mr-1 size-4" />
									New
								</SolidButton>
							{/snippet}
							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<TextInput isRequired name="name" label="Name" />
									<TextInput name="details" label="Details" />
								</div>
							{/snippet}
						</NewForm>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('name')}
					<TableHead sortBy="name" class="min-w-60">Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead sortBy="details" class="min-w-48">Details</TableHead>
				{/if}
				{#each Object.keys(countColumns) as column (column)}
					{#if columnsState.visibleColumns.includes(column)}
						<TableHead sortBy={column} class="min-w-40">{countColumns[column]}</TableHead>
					{/if}
				{/each}
				{#if sendCustomerMessageAction && !printerState.isPrinting}
					<TableHead class="min-w-48"></TableHead>
				{/if}
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
							<TablePrint name={key} />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.records ?? [] as record (record.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label={deleteLabel}
								action={`/nameDetails/${record.id}?/delete`}
								successMessage={deleteSuccessMessage}
								additionalFormData={deleteAdditionalFormData}
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={isDeleteDisabled}
										{onclick}
										--color-ghostButton="var(--color-red-600)"
										class="p-2 text-xs"
									>
										<TrashIcon class="mr-1 size-4" />
										<span>Delete</span>
									</GhostButton>
								{/snippet}
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to delete this record?</p>
								{/snippet}
							</ConfirmForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('name')}
						<TableCell class="py-1">
							<TextEditForm
								isDisabled={isNameEditDisabled}
								isRequired
								name="name"
								value={record.name}
								action={`/nameDetails/${record.id}?/updateName`}
								additionalFormData={updateNameAdditionalFormData}
								successMessage="Successfully updated name."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('details')}
						<TableCell>
							<TextEditForm
								isDisabled={isDetailsEditDisabled}
								name="details"
								value={record.details}
								action={`/nameDetails/${record.id}?/updateDetails`}
								additionalFormData={updateDetailsAdditionalFormData}
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
									{Intl.NumberFormat().format(record._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if sendCustomerMessageAction && !printerState.isPrinting}
						<TableCell class="text-center">
							<SendCustomerMessage
								infoMessage={sendCustomerMessageInfo}
								action={`${sendCustomerMessageAction}/${record.id}/?/messageCustomers`}
								class="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(record.updatedAt).toLocaleString('en-CA', {
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
								>{new Date(record.createdAt).toLocaleString('en-CA', {
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
