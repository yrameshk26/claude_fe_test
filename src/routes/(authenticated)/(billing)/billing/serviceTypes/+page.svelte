<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Service Types'

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

	import SendCustomerMessage from '$lib/components/forms/SendCustomerMessage.svelte'

	let { data } = $props()

	const countColumns = data.serviceTypes[0]
		? Object.keys(data.serviceTypes[0]._count).reduce((acc: Record<string, string>, curr) => {
				acc[curr] = curr.replaceAll(/(?<!^)(?=[A-Z])/g, ' ')
				acc[curr] = acc[curr].charAt(0).toUpperCase() + acc[curr].slice(1)
				return acc
			}, {})
		: {}
	$effect(() => {
		columnsState.set('serviceTypes', {
			name: 'Name',
			details: 'Details',
			topupDueDays: 'Top Up Due Days',
			reminderDays: 'Reminder Days',
			order: 'Order',
			color: 'Color',
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
							label="New Service Type"
							action="/billing/serviceTypes/new"
							successMessage="Successfully created new Service Type."
						>
							{#snippet trigger({ onclick })}
								<SolidButton
									{onclick}
									class="text-xs"
									isDisabled={!(
										data.session.isAdmin ||
										data.session.permissions.find(
											(p) => p.app === 'BILLING' && p.permissionType === 'ADD_SERVICE_TYPE'
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
									<TextInput
										name="topupDueDays"
										type="number"
										min={0}
										max={365}
										step={1}
										value={7}
										label="Topup Due Days"
									/>
									<TextInput
										name="reminderDays"
										type="number"
										min={0}
										max={365}
										step={1}
										value={3}
										label="Reminder Days"
									/>
									<TextInput name="color" label="Color" type="color" value="#000000" />
								</div>
							{/snippet}
						</NewForm>
					</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('name')}
					<TableHead sortBy="name" class="min-w-36">Name</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('details')}
					<TableHead sortBy="details" class="min-w-48">Details</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('topupDueDays')}
					<TableHead sortBy="topupDueDays" class="min-w-32">Topup Due</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('reminderDays')}
					<TableHead sortBy="reminderDays" class="min-w-32">Reminder</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('order')}
					<TableHead sortBy="order" class="min-w-28">Order</TableHead>
				{/if}
				{#if columnsState.visibleColumns.includes('color')}
					<TableHead class="min-w-20 text-center">Color</TableHead>
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
							<TablePrint name="Service Types" />
						</div>
					</TableHead>
				{/if}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.serviceTypes ?? [] as serviceType (serviceType.id)}
				<TableCellRow>
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<ConfirmForm
								label="Delete Service Type"
								action={`/billing/serviceTypes/${serviceType.id}?/deleteServiceType`}
								successMessage="Successfully deleted Service Type."
							>
								{#snippet trigger({ onclick })}
									<GhostButton
										isDisabled={!(
											data.session.isAdmin ||
											data.session.permissions.find(
												(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_SERVICE_TYPE'
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
									<p class="text-sm">Are you sure you want to delete this Service Type?</p>
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
										(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_NAME'
									)
								)}
								isRequired
								name="name"
								value={serviceType.name}
								action={`/billing/serviceTypes/${serviceType.id}?/updateServiceTypeName`}
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
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_DETAILS'
									)
								)}
								name="details"
								value={serviceType.details}
								action={`/billing/serviceTypes/${serviceType.id}?/updateServiceTypeDetails`}
								successMessage="Successfully updated details."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('topupDueDays')}
						<TableCell>
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_TOPUP_DUE_DAYS'
									)
								)}
								type="number"
								min={0}
								max={365}
								step={1}
								isRequired
								name="topupDueDays"
								value={serviceType.topupDueDays}
								action={`/billing/serviceTypes/${serviceType.id}?/updateServiceTypeTopupDueDays`}
								successMessage="Successfully updated top up due days."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							>
								{#snippet valueSnippet()}
									<div class="text-center">
										{serviceType.topupDueDays.toString().padStart(2, '0')}
									</div>
								{/snippet}
							</TextEditForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('reminderDays')}
						<TableCell>
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_REMINDER_DAYS'
									)
								)}
								type="number"
								min={0}
								max={365}
								step={1}
								isRequired
								name="reminderDays"
								value={serviceType.reminderDays}
								action={`/billing/serviceTypes/${serviceType.id}?/updateServiceTypeReminderDays`}
								successMessage="Successfully updated reminder days."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							>
								{#snippet valueSnippet()}
									<div class="text-center">
										{serviceType.reminderDays.toString().padStart(2, '0')}
									</div>
								{/snippet}
							</TextEditForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('order')}
						<TableCell>
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_ORDER'
									)
								)}
								type="number"
								step={1}
								isRequired
								name="order"
								value={serviceType.order || 999}
								action={`/billing/serviceTypes/${serviceType.id}?/updateServiceTypeOrder`}
								successMessage="Successfully updated order."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
							>
								{#snippet valueSnippet()}
									<div class="text-center">
										{(serviceType.order || 999).toString().padStart(2, '0')}
									</div>
								{/snippet}
							</TextEditForm>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('color')}
						<TableCell>
							<TextEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_TYPE_COLOR'
									)
								)}
								isRequired
								name="color"
								type="color"
								value={serviceType.color}
								action={`/billing/serviceTypes/${serviceType.id}?/updateServiceTypeColor`}
								successMessage="Successfully updated color."
								classForm="ring-0"
								classValue="text-xs"
								classInput="text-xs"
								hideCopyButton
							>
								{#snippet valueSnippet()}
									<div
										class="mx-auto h-6 w-6 rounded-full"
										style="background-color: {serviceType.color}"
									></div>
								{/snippet}
							</TextEditForm>
						</TableCell>
					{/if}
					{#each Object.keys(countColumns) as column (column)}
						{#if columnsState.visibleColumns.includes(column)}
							<TableCell class="tabular-nums">
								<TextBlock class="justify-center font-semibold">
									{Intl.NumberFormat().format(serviceType._count[column])}
								</TextBlock>
							</TableCell>
						{/if}
					{/each}
					{#if !printerState.isPrinting}
						<TableCell class="text-center">
							<SendCustomerMessage
								infoMessage="This will send a message to all customers linked to this Service Type."
								action={`/billing/serviceTypes/${serviceType.id}?/messageCustomers`}
								class="text-xs"
							/>
						</TableCell>
					{/if}
					{#if columnsState.visibleColumns.includes('updatedAt')}
						<TableCell>
							<TextBlock class="tabular-nums"
								>{new Date(serviceType.updatedAt).toLocaleString('en-CA', {
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
								>{new Date(serviceType.createdAt).toLocaleString('en-CA', {
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
