<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Main Call Categories'

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

	import { NewForm, ConfirmForm, TextEditForm, SelectEditForm } from '$sveltewind/components/forms'
	import { TextInput, SelectInput } from '$sveltewind/components/inputs'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { PlusIcon, TrashIcon } from '$sveltewind/icons'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'
	import { printerState } from '$sveltewind/components/table/TablePrint.svelte'

	let { data } = $props()

	const countColumns = {
		callCategoriesLevelThree: 'Sub Categories',
		callRecords: 'Call Records'
	}
	$effect(() => {
		columnsState.set('callCategoriesLevelTwo', {
			name: 'Name',
			details: 'Details',
			callCategoryLevelOne: 'Service Category',
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
							label="New Main Call Category"
							action="/calltrack/callCategories/levelTwo/new"
							successMessage="Successfully created new Main Call Category."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) =>
												p.app === 'CALLTRACK' && p.permissionType === 'ADD_CALL_CATEGORY_LEVEL_TWO'
										)
									)}
								>
									<PlusIcon class="mr-1 size-4" />
									New
								</SolidButton>
							{/snippet}
							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<SelectInput
										isRequired
										name="callCategoryLevelOneID"
										label="Service Category"
										loadMoreUrl="/_api/autocomplete/callCategoriesLevelOne"
									/>
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
				{#if columnsState.visibleColumns.includes('callCategoryLevelOne')}
					<TableHead sortBy="callCategoryLevelOne" class="min-w-60">Service Category</TableHead>
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
							<TablePrint name="Main Call Categories" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.callCategoriesLevelTwo ?? [] as callCategoryLevelTwo (callCategoryLevelTwo.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Main Call Category"
								action={`/calltrack/callCategories/levelTwo/${callCategoryLevelTwo.id}?/delete`}
								successMessage="Successfully deleted Main Call Category."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) =>
													p.app === 'CALLTRACK' &&
													p.permissionType === 'DELETE_CALL_CATEGORY_LEVEL_TWO'
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
									<p class="text-sm">Are you sure you want to delete this Main Call Category?</p>
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
											p.app === 'CALLTRACK' &&
											p.permissionType === 'EDIT_CALL_CATEGORY_LEVEL_TWO_NAME'
									)
								)}
								isRequired
								name="name"
								value={callCategoryLevelTwo.name}
								action={`/calltrack/callCategories/levelTwo/${callCategoryLevelTwo.id}?/updateCallCategoryLevelTwoName`}
								successMessage="Successfully updated Name."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('callCategoryLevelOne')}
						<TableCell>
							<SelectEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'CALLTRACK' &&
											p.permissionType === 'EDIT_CALL_CATEGORY_LEVEL_TWO_CALL_CATEGORY_LEVEL_ONE'
									)
								)}
								name="callCategoryLevelOneID"
								value={callCategoryLevelTwo.callCategoryLevelOne?.id}
								loadMoreUrl="/_api/autocomplete/callCategoriesLevelOne"
								action={`/calltrack/callCategories/levelTwo/${callCategoryLevelTwo.id}?/updateCallCategoryLevelTwoCallCategoryLevelOne`}
								successMessage="Successfully updated Service Category."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							>
								{#snippet valueSnippet()}
									{callCategoryLevelTwo.callCategoryLevelOne?.name}
								{/snippet}
							</SelectEditForm>
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
											p.permissionType === 'EDIT_CALL_CATEGORY_LEVEL_TWO_DETAILS'
									)
								)}
								name="details"
								value={callCategoryLevelTwo.details}
								action={`/calltrack/callCategories/levelTwo/${callCategoryLevelTwo.id}?/updateCallCategoryLevelTwoDetails`}
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
									{Intl.NumberFormat().format(callCategoryLevelTwo._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(callCategoryLevelTwo.updatedAt).toLocaleString('en-CA', {
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
								>{new Date(callCategoryLevelTwo.createdAt).toLocaleString('en-CA', {
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
