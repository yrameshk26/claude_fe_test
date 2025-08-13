<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Sub Call Categories'

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

	let newCallCategoryLevelOneID = $state('')

	const countColumns = {
		callRecords: 'Call Records'
	}
	$effect(() => {
		columnsState.set('callCategoriesLevelThree', {
			name: 'Name',
			details: 'Details',
			callCategoryLevelTwo: 'Main Category',
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
							label="New Sub Call Category"
							action="/calltrack/callCategories/levelThree/new"
							successMessage="Successfully created new Sub Call Category."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) =>
												p.app === 'CALLTRACK' &&
												p.permissionType === 'ADD_CALL_CATEGORY_LEVEL_THREE'
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
										bind:value={newCallCategoryLevelOneID}
										label="Service Category"
										loadMoreUrl="/_api/autocomplete/callCategoriesLevelOne"
									/>
									{#key newCallCategoryLevelOneID}
										<SelectInput
											isDisabled={!newCallCategoryLevelOneID}
											isRequired
											name="callCategoryLevelTwoID"
											label="Main Category"
											loadMoreUrl="/_api/autocomplete/callCategoriesLevelTwo?callCategoryLevelOneID={newCallCategoryLevelOneID}"
										/>
									{/key}
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
				{#if columnsState.visibleColumns.includes('callCategoryLevelTwo')}
					<TableHead sortBy="callCategoryLevelTwo" class="min-w-60">Main Category</TableHead>
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
							<TablePrint name="Sub Call Categories" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.callCategoriesLevelThree ?? [] as callCategoryLevelThree (callCategoryLevelThree.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Sub Call Category"
								action={`/calltrack/callCategories/levelThree/${callCategoryLevelThree.id}?/delete`}
								successMessage="Successfully deleted Sub Call Category."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) =>
													p.app === 'CALLTRACK' &&
													p.permissionType === 'DELETE_CALL_CATEGORY_LEVEL_THREE'
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
									<p class="text-sm">Are you sure you want to delete this Sub Call Category?</p>
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
											p.permissionType === 'EDIT_CALL_CATEGORY_LEVEL_THREE_NAME'
									)
								)}
								isRequired
								name="name"
								value={callCategoryLevelThree.name}
								action={`/calltrack/callCategories/levelThree/${callCategoryLevelThree.id}?/updateCallCategoryLevelThreeName`}
								successMessage="Successfully updated Name."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					<!-- {#if columnsState.visibleColumns.includes('callCategoryLevelOne')}
						<TableCell>
							<TextBlock>
								{callCategoryLevelThree.callCategoryLevelTwo.callCategoryLevelOne?.name}
							</TextBlock>
						</TableCell>
					{/if} -->
					{#if columnsState.visibleColumns.includes('callCategoryLevelTwo')}
						<TableCell>
							<SelectEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'CALLTRACK' &&
											p.permissionType === 'EDIT_CALL_CATEGORY_LEVEL_THREE_CALL_CATEGORY_LEVEL_TWO'
									)
								)}
								isRequired
								name="callCategoryLevelTwoID"
								value={callCategoryLevelThree.callCategoryLevelTwo?.id}
								loadMoreUrl="/_api/autocomplete/callCategoriesLevelTwo?callCategoryLevelOneID={callCategoryLevelThree
									.callCategoryLevelTwo.callCategoryLevelOneID}"
								action={`/calltrack/callCategories/levelThree/${callCategoryLevelThree.id}?/updateCallCategoryLevelThreeCallCategoryLevelTwo`}
								successMessage="Successfully updated Main Category."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							>
								{#snippet valueSnippet()}
									{callCategoryLevelThree.callCategoryLevelTwo?.name}
								{/snippet}
							</SelectEditForm>

							<div class="flex items-center px-3 text-xs">
								<span class="mr-1">Service:</span>
								<TextBlock>
									{callCategoryLevelThree.callCategoryLevelTwo.callCategoryLevelOne?.name}
								</TextBlock>
							</div>
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
											p.permissionType === 'EDIT_CALL_CATEGORY_LEVEL_THREE_DETAILS'
									)
								)}
								name="details"
								value={callCategoryLevelThree.details}
								action={`/calltrack/callCategories/levelThree/${callCategoryLevelThree.id}?/updateCallCategoryLevelThreeDetails`}
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
									{Intl.NumberFormat().format(callCategoryLevelThree._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(callCategoryLevelThree.updatedAt).toLocaleString('en-CA', {
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
								>{new Date(callCategoryLevelThree.createdAt).toLocaleString('en-CA', {
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
