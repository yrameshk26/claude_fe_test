<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Service Type Urls'

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

	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import SendCustomerMessage from '$lib/components/forms/SendCustomerMessage.svelte'

	let { data } = $props()

	const countColumns = data.serviceTypeUrls[0]
		? Object.keys(data.serviceTypeUrls[0]._count).reduce((acc: Record<string, string>, curr) => {
				acc[curr] = curr.replaceAll(/(?<!^)(?=[A-Z])/g, ' ')
				acc[curr] = acc[curr].charAt(0).toUpperCase() + acc[curr].slice(1)
				return acc
			}, {})
		: {}
	$effect(() => {
		columnsState.set('serviceTypeUrls', {
			urlName: 'URL Name',
			url: 'URL',
			serviceType: 'Service Type',
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
							label="New Service Type Url"
							action="/billing/serviceTypeURLs/new"
							successMessage="Successfully created new Service Type Url."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) => p.app === 'BILLING' && p.permissionType === 'ADD_SERVICE_TYPE_URL'
										)
									)}
								>
									<PlusIcon class="mr-1 size-4" />
									New
								</SolidButton>
							{/snippet}
							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<TextInput isRequired name="urlName" label="URL Name" />
									<TextInput isRequired name="url" label="URL" />
									<SelectInput
										isRequired
										name="serviceTypeID"
										label="Service Type"
										loadMoreUrl="/_api/autocomplete/serviceTypes"
									/>
								</div>
							{/snippet}
						</NewForm>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('urlName')}
					<TableHead sortBy="urlName" class="min-w-44">URL Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('url')}
					<TableHead sortBy="url" class="min-w-96">URL</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('serviceType')}
					<TableHead sortBy="serviceType" class="min-w-40">Service Type</TableHead>
				{/if}
				{#each Object.keys(countColumns) as column (column)}
					{#if columnsState.visibleColumns.includes(column)}
						<TableHead sortBy={column} class="min-w-36">{countColumns[column]}</TableHead>
					{/if}
				{/each}
				{#if !printerState.isPrinting}
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
							<TablePrint name="Service Type Urls" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.serviceTypeUrls ?? [] as serviceTypeUrl (serviceTypeUrl.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Service Type Url"
								action={`/billing/serviceTypeURLs/${serviceTypeUrl.id}?/delete`}
								successMessage="Successfully deleted Service Type Url."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_SERVICE_TYPE_URL'
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
									<p class="text-sm">Are you sure you want to delete this Service Type Url?</p>
								{/snippet}
							</ConfirmForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('urlName')}
						<TableCell class="py-1">
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_URL_URL_NAME'
									)
								)}
								name="urlName"
								value={serviceTypeUrl.urlName}
								action={`/billing/serviceTypeURLs/${serviceTypeUrl.id}?/updateServiceTypeUrlUrlName`}
								successMessage="Successfully updated URL Name."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('url')}
						<TableCell>
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_URL_URL'
									)
								)}
								name="url"
								value={serviceTypeUrl.url}
								action={`/billing/serviceTypeURLs/${serviceTypeUrl.id}?/updateServiceTypeUrlUrl`}
								successMessage="Successfully updated URL."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('serviceType')}
						<TableCell>
							<SelectEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'BILLING' &&
											p.permissionType === 'EDIT_SERVICE_TYPE_URL_SERVICE_TYPE'
									)
								)}
								isRequired
								name="serviceTypeID"
								value={serviceTypeUrl.serviceType.id}
								loadMoreUrl="/_api/autocomplete/serviceTypes"
								action={`/billing/serviceTypeURLs/${serviceTypeUrl.id}?/updateServiceTypeUrlServiceType`}
								successMessage="Successfully updated service type."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
								hideCopyButton
							>
								{#snippet valueSnippet()}
									<ServiceTypeLink serviceType={serviceTypeUrl.serviceType} />
								{/snippet}
							</SelectEditForm>
						</TableCell>
					{/if}
					{#each Object.keys(countColumns) as column (column)}
						{#if columnsState.visibleColumns.includes(column)}
							<TableCell class="tabular-nums">
								<TextBlock class="justify-center font-semibold">
									{Intl.NumberFormat().format(serviceTypeUrl._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<SendCustomerMessage
								infoMessage="This will send a message to all customers linked to this Service Type Url."
								action={`/billing/serviceTypeURLs/${serviceTypeUrl.id}?/messageCustomers`}
								class="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(serviceTypeUrl.updatedAt).toLocaleString('en-CA', {
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
								>{new Date(serviceTypeUrl.createdAt).toLocaleString('en-CA', {
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
