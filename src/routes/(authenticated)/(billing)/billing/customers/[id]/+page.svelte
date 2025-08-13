<script lang="ts">
	import ViewPhoneNumbers from '$lib/components/views/ViewPhoneNumbers.svelte'
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'
	import SendCustomerMessage from '$lib/components/forms/SendCustomerMessage.svelte'

	import { Alert } from '$sveltewind/components/display'
	import {
		DateEditForm,
		TextEditForm,
		SelectEditForm,
		ToggleEditForm,
		AddressEditForm,
		ConfirmForm
	} from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'

	import { page } from '$app/state'

	let { data } = $props()
</script>

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else}
	<div class="grid gap-4 lg:grid-cols-7 lg:gap-8">
		<div class="p-2 lg:col-span-5">
			{#if data.customer.isTrial}
				<Alert type="warning">
					<div class="flex w-full items-center gap-2">
						<div class="flex-1 font-semibold">
							Remove trial status? You won't be able to make this customer a trial again.
						</div>
						<ToggleEditForm
							name="isTrial"
							value={data.customer.isTrial}
							action={`/billing/customers/${data.customer.id}?/removeCustomerIsTrial`}
							successMessage="Successfully updated is trial."
							classForm="ring-0 w-fit"
						/>
					</div>
				</Alert>
			{/if}
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Basic Info</h2>
						<DateEditForm
							isRequired
							name="joinedDate"
							label="Joined Date"
							value={data.customer.joinedDate}
							action={`/billing/customers/${data.customer.id}?/updateCustomerJoinedDate`}
							successMessage="Successfully updated joined date."
						/>
						<TextEditForm
							isRequired
							name="fullName"
							label="Full Name"
							value={data.customer.fullName}
							action={`/billing/customers/${data.customer.id}?/updateCustomerFullName`}
							successMessage="Successfully updated full name."
						/>
						<TextEditForm
							type="email"
							name="email"
							label="Email"
							value={data.customer.email}
							action={`/billing/customers/${data.customer.id}?/updateCustomerEmail`}
							successMessage="Successfully updated email."
						/>
						<TextEditForm
							isRequired
							name="pin"
							label="Pin"
							maskitoOptions={{ mask: [/\d/, /\d/, /\d/, /\d/] }}
							value={data.customer.pin}
							action={`/billing/customers/${data.customer.id}?/updateCustomerPin`}
							successMessage="Successfully updated pin."
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Phone Numbers</h2>
						<ViewPhoneNumbers
							phoneNumbers={data.customer.phoneNumbers}
							newPhoneNumberFormAction="/phoneNumbers?/addCustomerPhoneNumber"
							additionalFormData={{ customerID: data.customer.id }}
						/>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Join Info</h2>
						<div class="grid grid-cols-3 justify-between gap-4">
							<SelectEditForm
								name="sourceID"
								label="Source"
								value={data.customer.source?.id}
								loadMoreUrl="/_api/autocomplete/sources"
								action={`/billing/customers/${data.customer.id}?/updateCustomerSource`}
								successMessage="Successfully updated source."
							>
								{#snippet valueSnippet()}
									{data.customer.source?.name || '-'}
								{/snippet}
							</SelectEditForm>
							<SelectEditForm
								name="languageID"
								label="Language"
								value={data.customer.language?.id}
								loadMoreUrl="/_api/autocomplete/languages"
								action={`/billing/customers/${data.customer.id}?/updateCustomerLanguage`}
								successMessage="Successfully updated language."
							>
								{#snippet valueSnippet()}
									{data.customer.language?.name || '-'}
								{/snippet}
							</SelectEditForm>
							<ToggleEditForm
								name="isFromCall"
								label="Is From Call"
								value={data.customer.isFromCall}
								action={`/billing/customers/${data.customer.id}?/updateCustomerIsFromCall`}
								successMessage="Successfully updated is from call."
							/>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Address</h2>
						<AddressEditForm
							value=""
							placeholder="Search for an address"
							action={`/billing/customers/${data.customer.id}?/updateCustomerAddress`}
							successMessage="Successfully updated the address."
						>
							{#snippet valueSnippet()}
								<span class="text-xs text-gray-500"> Replace the entire address </span>
							{/snippet}
						</AddressEditForm>
						<div class="grid grid-cols-6 gap-2">
							<TextEditForm
								name="streetNumber"
								label="Street No."
								value={data.customer.streetNumber}
								action={`/billing/customers/${data.customer.id}?/updateCustomerStreetNumber`}
								successMessage="Successfully updated street number."
							/>
							<TextEditForm
								name="streetName"
								label="Street Name"
								value={data.customer.streetName}
								action={`/billing/customers/${data.customer.id}?/updateCustomerStreetName`}
								successMessage="Successfully updated street name."
								classForm="col-span-3"
							/>
							<TextEditForm
								name="city"
								label="City"
								value={data.customer.city}
								action={`/billing/customers/${data.customer.id}?/updateCustomerCity`}
								successMessage="Successfully updated city."
								classForm="col-span-2"
							/>
						</div>
						<div class="grid grid-cols-3 gap-2">
							<TextEditForm
								name="postalCode"
								label="Postal Code"
								value={data.customer.postalCode}
								action={`/billing/customers/${data.customer.id}?/updateCustomerPostalCode`}
								successMessage="Successfully updated postal code."
							/>
							<TextEditForm
								name="province"
								label="Province"
								value={data.customer.province}
								action={`/billing/customers/${data.customer.id}?/updateCustomerProvince`}
								successMessage="Successfully updated province."
							/>
							<TextEditForm
								name="country"
								label="Country"
								value={data.customer.country}
								action={`/billing/customers/${data.customer.id}?/updateCustomerCountry`}
								successMessage="Successfully updated country."
							/>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Send Reminder By</h2>
						<div class="grid grid-cols-3 justify-between gap-4">
							<ToggleEditForm
								name="skipPromotion"
								label="Skip Promotion"
								value={data.customer.skipPromotion}
								action={`/billing/customers/${data.customer.id}?/updateCustomerSkipPromotion`}
								successMessage="Successfully updated skip promotion."
								classForm="col-span-3 w-fit"
							/>
							<ToggleEditForm
								name="sendReminderByEmail"
								label="Email"
								value={data.customer.sendReminderBy.includes('EMAIL')}
								action={`/billing/customers/${data.customer.id}?/updateCustomerSendReminderByEmail`}
								successMessage="Successfully updated send reminder by email."
								additionalFormData={{
									sendReminderBy: JSON.stringify(data.customer.sendReminderBy)
								}}
							/>
							<ToggleEditForm
								name="sendReminderBySMS"
								label="SMS"
								value={data.customer.sendReminderBy.includes('SMS')}
								action={`/billing/customers/${data.customer.id}?/updateCustomerSendReminderBySMS`}
								successMessage="Successfully updated send reminder by SMS."
								additionalFormData={{
									sendReminderBy: JSON.stringify(data.customer.sendReminderBy)
								}}
							/>
							<ToggleEditForm
								name="sendReminderByWhatsapp"
								label="Whatsapp"
								value={data.customer.sendReminderBy.includes('WHATSAPP')}
								action={`/billing/customers/${data.customer.id}?/updateCustomerSendReminderByWhatsapp`}
								successMessage="Successfully updated send reminder by whatsapp."
								additionalFormData={{
									sendReminderBy: JSON.stringify(data.customer.sendReminderBy)
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ViewNotes
				searchQuery={`?customerID=${page.params.id}`}
				newNoteFormAction="/notes?/addCustomerNote"
			/>

			<ViewAuditTrail object={data.customer} />

			<SendCustomerMessage
				isSingleCustomer
				infoMessage="This will send a message to this customer."
				action={`/billing/customers/${data.customer.id}?/sendCustomerMessage`}
			/>

			<ConfirmForm
				label="Delete Customer"
				action={`/billing/customers/${data.customer.id}?/deleteCustomer`}
				successMessage="Successfully deleted the customer."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_CUSTOMER'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Customer</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this customer?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
