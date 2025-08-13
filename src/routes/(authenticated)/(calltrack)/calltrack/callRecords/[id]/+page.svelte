<script lang="ts">
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert, TextBlock } from '$sveltewind/components/display'
	import {
		DateTimeEditForm,
		SelectEditForm,
		TextEditForm,
		TimeEditForm,
		ToggleEditForm,
		ConfirmForm,
		NewForm
	} from '$sveltewind/components/forms'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'
	import { SelectInput } from '$sveltewind/components/inputs'

	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import EndActiveCall from '$lib/components/forms/EndActiveCall.svelte'

	import { page } from '$app/state'

	let { data } = $props()

	let newCallCategories = $state({
		callCategoryLevelOneID: data.callRecord?.callCategoryLevelOneID,
		callCategoryLevelTwoID: data.callRecord?.callCategoryLevelTwoID,
		callCategoryLevelThreeID: data.callRecord?.callCategoryLevelThreeID
	})

	const formatDuration = (seconds: number = 0) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const remainingSeconds = seconds % 60
		return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`
	}

	const formatDurationInput = (seconds: number = 0) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const remainingSeconds = seconds % 60
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
	}
</script>

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else}
	<div class="grid gap-4 lg:grid-cols-7 lg:gap-8">
		<div class="p-2 lg:col-span-5">
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Call Info</h2>
						<SelectEditForm
							isRequired
							name="storePhoneNumberID"
							label="Store Phone"
							value={data.callRecord.storePhoneNo?.id}
							loadMoreUrl="/_api/autocomplete/storePhoneNumbers"
							action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordStorePhoneNo`}
							successMessage="Successfully updated store phone number."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<div class="pt-2">
									<TextBlock>{data.callRecord.storePhoneNumber.phoneNo}</TextBlock>
									<TextBlock class="text-xs">{data.callRecord.storePhoneNumber.name}</TextBlock>
								</div>
							{/snippet}
						</SelectEditForm>
						<DateTimeEditForm
							isRequired
							isDisabled
							name="startTime"
							label="Start Time"
							value={data.callRecord.startTime}
							action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordStartTime`}
							successMessage="Successfully updated start time."
						/>
						{#if data.callRecord.endTime}
							<DateTimeEditForm
								isRequired
								name="endTime"
								label="End Time"
								value={data.callRecord.endTime}
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordEndTime`}
								successMessage="Successfully updated end time."
							/>
							<span class="rounded-md bg-green-200 p-3 text-sm">
								Duration: <span class="font-bold tabular-nums"
									>{formatDuration(data.callRecord.duration)}</span
								>
							</span>
						{:else}
							<EndActiveCall callRecord={data.callRecord} />
						{/if}
						<TimeEditForm
							name="customerWaitSeconds"
							label="Wait Time"
							value={formatDurationInput(data.callRecord.customerWaitSeconds)}
							action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordCustomerWaitSeconds`}
							successMessage="Successfully updated wait time."
						>
							{#snippet valueSnippet()}
								{#if data.callRecord.customerWaitSeconds}
									{formatDuration(data.callRecord.customerWaitSeconds)}
								{:else}
									-
								{/if}
							{/snippet}
						</TimeEditForm>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Other Info</h2>
						<div class="grid gap-4 lg:grid-cols-4">
							<SelectEditForm
								name="callType"
								label="Call Type"
								value={data.callRecord.callType}
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordCallType`}
								loadMoreUrl="/_api/autocomplete/callTypes"
								successMessage="Successfully updated call type."
								classForm="lg:col-span-2"
							>
								{#snippet valueSnippet()}
									{#if data.callRecord.callType}
										{data.callRecord.callType.replace(/_/g, ' ')}
									{:else}
										-
									{/if}
								{/snippet}
							</SelectEditForm>
							<TextEditForm
								name="customerPhoneNo"
								label="Customer Phone No"
								value={data.callRecord.customerPhoneNo}
								maskitoOptions={{
									mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
								}}
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordCustomerPhoneNo`}
								successMessage="Successfully updated customer phone no."
							/>

							<ToggleEditForm
								name="isNewCustomer"
								label="Is New Customer"
								value={data.callRecord.isNewCustomer}
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordIsNewCustomer`}
								successMessage="Successfully updated is new customer."
							/>
						</div>

						<div class="grid gap-4 lg:grid-cols-2">
							<SelectEditForm
								name="serviceTypeID"
								label="Service Type"
								value={data.callRecord.serviceType?.id}
								loadMoreUrl="/_api/autocomplete/serviceTypes"
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordServiceType`}
								successMessage="Successfully updated service type."
								hideCopyButton
								classForm="h-fit"
							>
								{#snippet valueSnippet()}
									{#if data.callRecord.serviceType}
										<ServiceTypeLink serviceType={data.callRecord.serviceType} />
									{:else}
										-
									{/if}
								{/snippet}
							</SelectEditForm>
							<SelectEditForm
								name="productTypeID"
								label="Product Type"
								value={data.callRecord.productType?.id}
								loadMoreUrl="/_api/autocomplete/productTypes"
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordProductType`}
								successMessage="Successfully updated product type."
								hideCopyButton
							>
								{#snippet valueSnippet()}
									<NameDetailsLink
										path="/billing/productTypes"
										record={data.callRecord.productType}
									/>
								{/snippet}
							</SelectEditForm>
							<TextEditForm
								name="macID"
								label="Mac ID"
								maskitoOptions={{
									mask: [
										/\w/,
										/\w/,
										':',
										/\w/,
										/\w/,
										':',
										/\w/,
										/\w/,
										':',
										/\w/,
										/\w/,
										':',
										/\w/,
										/\w/,
										':',
										/\w/,
										/\w/
									]
								}}
								value={data.callRecord.macID}
								action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordMacID`}
								successMessage="Successfully updated mac id."
							/>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Call Categories</h2>
						<NewForm
							label="Update Call Categories"
							action={`/calltrack/callRecords/${data.callRecord.id}?/updateCallRecordCallCategory`}
							successMessage="Successfully updated call category."
							onClose={() => {
								newCallCategories = {
									callCategoryLevelOneID: data.callRecord.callCategoryLevelOneID,
									callCategoryLevelTwoID: data.callRecord.callCategoryLevelTwoID,
									callCategoryLevelThreeID: data.callRecord.callCategoryLevelThreeID
								}
							}}
						>
							{#snippet trigger({ onclick })}
								<GhostButton {onclick} class="px-0 text-xs hover:bg-gray-100">
									<div class="grid w-full gap-4 px-2 lg:grid-cols-3">
										<div class="rounded-md p-2 ring-1 ring-gray-300">
											<div class="text-xs font-semibold">Service</div>
											{#if data.callRecord.callCategoryLevelOne}
												<TextBlock>{data.callRecord.callCategoryLevelOne.name}</TextBlock>
											{:else}
												-
											{/if}
										</div>
										<div class="rounded-md p-2 ring-1 ring-gray-300">
											<div class="text-xs font-semibold">Main</div>
											{#if data.callRecord.callCategoryLevelTwo}
												<TextBlock>{data.callRecord.callCategoryLevelTwo.name}</TextBlock>
											{:else}
												-
											{/if}
										</div>
										<div class="rounded-md p-2 ring-1 ring-gray-300">
											<div class="text-xs font-semibold">Sub</div>
											{#if data.callRecord.callCategoryLevelThree}
												<TextBlock>{data.callRecord.callCategoryLevelThree.name}</TextBlock>
											{:else}
												-
											{/if}
										</div>
									</div>
								</GhostButton>
							{/snippet}
							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<SelectInput
										isRequired={!!newCallCategories.callCategoryLevelTwoID}
										name="callCategoryLevelOneID"
										bind:value={newCallCategories.callCategoryLevelOneID}
										label="Service"
										loadMoreUrl="/_api/autocomplete/callCategoriesLevelOne"
										onSelect={() => {
											newCallCategories.callCategoryLevelTwoID = null
											newCallCategories.callCategoryLevelThreeID = null
										}}
									/>

									{#key newCallCategories.callCategoryLevelOneID}
										<SelectInput
											isDisabled={!newCallCategories.callCategoryLevelOneID}
											name="callCategoryLevelTwoID"
											bind:value={newCallCategories.callCategoryLevelTwoID}
											label="Main"
											loadMoreUrl="/_api/autocomplete/callCategoriesLevelTwo?callCategoryLevelOneID={newCallCategories.callCategoryLevelOneID}"
											onSelect={() => {
												newCallCategories.callCategoryLevelThreeID = null
											}}
										/>
									{/key}

									{#key newCallCategories.callCategoryLevelTwoID}
										<SelectInput
											isDisabled={!newCallCategories.callCategoryLevelTwoID}
											name="callCategoryLevelThreeID"
											bind:value={newCallCategories.callCategoryLevelThreeID}
											label="Sub"
											loadMoreUrl="/_api/autocomplete/callCategoriesLevelThree?callCategoryLevelOneID={newCallCategories.callCategoryLevelOneID}&callCategoryLevelTwoID={newCallCategories.callCategoryLevelTwoID}"
										/>
									{/key}
								</div>
							{/snippet}
						</NewForm>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ViewNotes
				searchQuery={`?callRecordID=${page.params.id}`}
				newNoteFormAction="/notes?/addCallRecordNote"
			/>

			<ViewAuditTrail object={data.callRecord} />

			<ConfirmForm
				label="Delete Call Record"
				action={`/calltrack/callRecords/${data.callRecord.id}?/deleteCallRecord`}
				successMessage="Successfully deleted the Call Record."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'CALLTRACK' && p.permissionType === 'DELETE_CALL_RECORD'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Call Record</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this Call Record?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
