<script lang="ts">
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert } from '$sveltewind/components/display'
	import {
		DateEditForm,
		TextEditForm,
		SelectEditForm,
		ToggleEditForm,
		ConfirmForm
	} from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'
	import { UserIcon } from '$icons'

	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import ServiceTypeUrlLink from '$lib/components/links/ServiceTypeUrlLink.svelte'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import ServiceCredits from '../_components/ServiceCredits.svelte'
	import ServiceTopup from '../_components/ServiceTopup.svelte'

	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'
	import TextBlock from '$sveltewind/components/display/TextBlock.svelte'

	let { data } = $props()
</script>

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else}
	<div class="grid gap-4 lg:grid-cols-7 lg:gap-8">
		<div class="flex flex-col gap-4 p-2 lg:col-span-5">
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Basic Info</h2>
						<DateEditForm
							isRequired
							name="createdDate"
							label="Created Date"
							value={data.service.createdDate}
							action={`/billing/services/${data.service.id}?/updateServiceCreatedDate`}
							successMessage="Successfully updated joined date."
						/>
						<TextEditForm
							isRequired={!data.service.accountNumber}
							name="macID"
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
							label="MAC ID"
							value={data.service.macID}
							action={`/billing/services/${data.service.id}?/updateServiceMacID`}
							successMessage="Successfully updated MAC ID."
						/>
						<span class="-my-3 text-xs text-gray-500">
							Either MAC ID or Account Number is required.
						</span>
						<TextEditForm
							isRequired={!data.service.macID}
							name="accountNumber"
							label="Account Number"
							value={data.service.accountNumber}
							action={`/billing/services/${data.service.id}?/updateServiceAccountNumber`}
							successMessage="Successfully updated account number."
						/>
						<SelectEditForm
							name="serviceTypeID"
							label="Service Type"
							value={data.service.serviceType?.id}
							loadMoreUrl="/_api/autocomplete/serviceTypes"
							action={`/billing/services/${data.service.id}?/updateServiceServiceType`}
							successMessage="Successfully updated service type."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<ServiceTypeLink serviceType={data.service.serviceType} />
							{/snippet}
						</SelectEditForm>
						<SelectEditForm
							name="serviceTypeUrlID"
							label="Service Type URL"
							value={data.service.serviceTypeUrl?.id}
							loadMoreUrl="/_api/autocomplete/serviceTypeUrls?serviceTypeID={data.service
								.serviceType?.id}"
							action={`/billing/services/${data.service.id}?/updateServiceServiceTypeUrl`}
							successMessage="Successfully updated service type url."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<ServiceTypeUrlLink serviceTypeUrl={data.service.serviceTypeUrl} />
								{#if data.service.serviceTypeUrl}
									<span class="text-xs text-gray-700">
										{data.service.serviceTypeUrl.url}
									</span>
								{/if}
							{/snippet}
						</SelectEditForm>
						<SelectEditForm
							name="productTypeID"
							label="Product Type"
							value={data.service.productType?.id}
							loadMoreUrl="/_api/autocomplete/productTypes"
							action={`/billing/services/${data.service.id}?/updateServiceProductType`}
							successMessage="Successfully updated product type."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<NameDetailsLink path="/billing/productTypes" record={data.service.productType} />
							{/snippet}
						</SelectEditForm>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
					<div class="flex flex-col gap-4">
						<div class="grid gap-4 lg:grid-cols-2">
							<div class="flex flex-col gap-2">
								<h2 class="font-semibold">Credits</h2>
								<ServiceCredits service={data.service}>
									<span
										class={twMerge(
											'inline-flex w-fit items-center rounded-md p-4 text-5xl font-bold tabular-nums',
											data.service.credits > 5 && 'bg-green-200',
											data.service.credits <= 5 && data.service.credits > 2 && 'bg-yellow-200',
											data.service.credits <= 2 && 'bg-red-200'
										)}
									>
										{data.service.credits.toString().padStart(2, '0')}
									</span>
								</ServiceCredits>
							</div>
							<div class="flex flex-col gap-2">
								<h2 class="font-semibold">&nbsp;<span class="sr-only">Topup</span></h2>
								<ServiceTopup service={data.service} />
							</div>
						</div>
						<div class="-my-1 flex flex-col gap-2">
							{#if data.service.inactive || data.service.putOnHold || data.service.isTrial}
								<Alert type="warning" class="w-full lg:col-span-2">
									This service is {data.service.inactive
										? 'inactive'
										: data.service.putOnHold
											? 'on hold'
											: 'in trial'}. You can't add/remove credits from it.
								</Alert>
							{/if}
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Expiry</h2>
						<div class="grid grid-cols-2 justify-between gap-4">
							<DateEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SERVICE_EXPIRY_DATE'
									)
								) ||
									data.service.inactive ||
									data.service.putOnHold ||
									data.service.isTrial}
								isRequired={!(
									data.service.inactive ||
									data.service.putOnHold ||
									data.service.isTrial
								)}
								name="expiryDate"
								label="Expiry Date"
								value={data.service.expiryDate}
								action={`/billing/services/${data.service.id}?/updateServiceExpiryDate`}
								successMessage="Successfully updated expiry date."
							/>
							<div class="flex flex-col rounded-md px-3 py-2 ring-1 ring-gray-300">
								<span class="text-xs font-bold text-gray-900">Actual Expiry Date</span>
								{#if data.service.actualExpiryDate}
									<TextBlock class="text-sm font-medium text-orange-700">
										{data.service.actualExpiryDate.slice(0, 10)}
									</TextBlock>
								{:else}
									-
								{/if}
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Status</h2>
						<div class="grid grid-cols-3 justify-between gap-4">
							<ToggleEditForm
								name="inactive"
								label="Is Inactive"
								value={!!data.service.inactive}
								action={`/billing/services/${data.service.id}?/updateServiceInactive`}
								successMessage="Successfully updated is inactive."
							/>
							<ToggleEditForm
								name="isMonthly"
								label="Is Monthly"
								value={!!data.service.isMonthly}
								action={`/billing/services/${data.service.id}?/updateServiceIsMonthly`}
								successMessage="Successfully updated is monthly."
							/>
							<ToggleEditForm
								name="isSwitched"
								label="Is Switched"
								value={!!data.service.isSwitched}
								action={`/billing/services/${data.service.id}?/updateServiceIsSwitched`}
								successMessage="Successfully updated is switched."
							/>
							<ToggleEditForm
								isDisabled={!(
									data.session.isAdmin ||
									data.session.permissions.find(
										(p) =>
											p.app === 'BILLING' &&
											(data.service.putOnHold
												? p.permissionType === 'REMOVE_ON_HOLD'
												: p.permissionType === 'PUT_ON_HOLD')
									)
								)}
								name="putOnHold"
								label="On Hold"
								value={!!data.service.putOnHold}
								action={`/billing/services/${data.service.id}?/updateServiceOnHold`}
								successMessage="Successfully updated on hold."
							/>
							<DateEditForm
								isDisabled={!data.service.putOnHold}
								name="onHoldDate"
								label="On Hold Date"
								value={data.service.onHoldDate ? data.service.onHoldDate : ''}
								action={`/billing/services/${data.service.id}?/updateServiceOnHoldDate`}
								successMessage="Successfully updated on hold date."
								classForm="col-span-2"
							/>
						</div>
					</div>
				</div>
			</div>
			<ViewNotes
				searchQuery={`?serviceID=${page.params.id}`}
				notes={data.service.notes}
				newNoteFormAction="/notes?/addServiceNote"
			/>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<!-- <ViewNotes
				searchQuery={`?serviceID=${page.params.id}`}
				notes={data.service.notes}
				newNoteFormAction="/notes?/addServiceNote"
			/> -->

			<ToggleEditForm
				name="isFromCall"
				label="Is From Call"
				value={data.service.isFromCall}
				action={`/billing/services/${data.service.id}?/updateServiceIsFromCall`}
				successMessage="Successfully updated is from call."
			/>
			<ViewAuditTrail object={data.service} />

			<div class="flex flex-col gap-4">
				<SelectEditForm
					name="customerID"
					label="Switch Customer"
					value={data.service.customer?.id}
					loadMoreUrl="/_api/autocomplete/customers"
					action={`/billing/services/${data.service.id}?/updateServiceCustomer`}
					successMessage="Successfully updated customer."
					hideCopyButton
				>
					{#snippet valueSnippet()}
						<div>
							<TextBlock>
								{data.service.customer.fullName}
							</TextBlock>
							{#if data.service.customer.phoneNumbers?.[0]}
								<TextBlock>
									{data.service.customer.phoneNumbers[0].value}
								</TextBlock>
							{/if}
						</div>
					{/snippet}
				</SelectEditForm>

				<SolidButton
					isDisabled={!(
						data.session.isAdmin ||
						data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'SEPARATE_CUSTOMERS'
						)
					)}
					href={`/billing/customers/createFromService?serviceID=${page.params.id}`}
					--color-solidButton="var(--color-blue-600)"
				>
					<UserIcon class="mr-2 size-4" />
					Create New Customer From Service
				</SolidButton>
			</div>

			<ConfirmForm
				label="Delete Service"
				action={`/billing/services/${data.service.id}?/deleteService`}
				successMessage="Successfully deleted the service."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_SERVICE'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Service</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this service?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
