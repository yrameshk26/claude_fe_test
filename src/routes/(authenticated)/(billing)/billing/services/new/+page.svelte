<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'New Service'

	import { Tabs } from '$sveltewind/components/display'

	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import { SolidButton } from '$sveltewind/components/buttons'
	import {
		DateInput,
		TextInput,
		TextareaInput,
		SelectInput,
		ToggleInput
	} from '$sveltewind/components/inputs'
	import { Alert } from '$sveltewind/components/display'

	import UserSelectInput from '$lib/components/UserSelectInput.svelte'

	import type { SubmitFunction } from '@sveltejs/kit'
	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		// remove undefined values from formData
		for (const [key, value] of [...formData.entries()]) {
			if (value === undefined || value === '' || value === null) {
				formData.delete(key)
			}
		}
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				const newServiceID = result.data
				goto(`/billing/services/${newServiceID}`)
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}

	let macID = $state('')
	let accountNumber = $state('')
	let serviceTypeID = $state('')
	let putOnHold = $state(false)
	let isTrial = $state(false)
	let credits = $state(1)
</script>

<Tabs />

<form
	method="POST"
	use:enhance={onSubmit}
	class="grid h-[calc(100%-56px)] gap-4 overflow-auto p-2 lg:grid-cols-7 lg:gap-8"
>
	<div class="p-2 lg:col-span-5">
		<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
			<div class="flex flex-col gap-4 lg:gap-8">
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Basic Info</h2>
					<DateInput isRequired name="createdDate" label="Created Date" />
					<SelectInput
						isRequired
						name="customerID"
						label="Customer"
						loadMoreUrl="/_api/autocomplete/customers"
						value={page.url.searchParams.get('customerID') || ''}
					/>
					<TextInput
						autofocus
						isRequired={!accountNumber}
						name="macID"
						bind:value={macID}
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
					/>
					<span class="-my-3 text-xs text-gray-500">
						Either MAC ID or Account Number is required.
					</span>
					<TextInput
						isRequired={!macID}
						name="accountNumber"
						bind:value={accountNumber}
						label="Account Number"
					/>
					<SelectInput
						isRequired
						name="serviceTypeID"
						label="Service Type"
						loadMoreUrl="/_api/autocomplete/serviceTypes"
						bind:value={serviceTypeID}
					/>
					{#key `/_api/autocomplete/serviceTypeUrls?serviceTypeID=${serviceTypeID}`}
						<SelectInput
							isDisabled={!serviceTypeID}
							name="serviceTypeUrlID"
							label="Service Type URL"
							loadMoreUrl="/_api/autocomplete/serviceTypeUrls?serviceTypeID={serviceTypeID}"
						/>
					{/key}
					<SelectInput
						isRequired
						name="productTypeID"
						label="Product Type"
						loadMoreUrl="/_api/autocomplete/productTypes"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Status</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<ToggleInput
							bind:value={isTrial}
							name="isTrial"
							label="Is Trial"
							onToggle={(value) => {
								if (!value) {
									credits = 0
								} else {
									credits = 1
								}
							}}
						/>
						<ToggleInput name="isMonthly" label="Is Monthly" />
						<ToggleInput name="isSwitched" label="Server Switched" />

						<ToggleInput name="putOnHold" label="Put on Hold" bind:value={putOnHold} />
						<DateInput
							isDisabled={!putOnHold}
							name="onHoldDate"
							label="On Hold Date"
							value={putOnHold
								? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
								: null}
						/>

						<DateInput
							isRequired
							name="expiryDate"
							label="Expiry Date"
							value={new Date(new Date().setDate(new Date().getDate() + 30))}
						/>
						<Alert type="warning" class="lg:col-span-3">
							Creating a service that is <strong>not on hold or trial</strong> - will automatically topup
							for the first month.
						</Alert>
					</div>
				</div>

				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Transaction</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<SelectInput
							isRequired
							name="transactionType"
							label="Transaction Type"
							loadMoreUrl="/_api/autocomplete/billingTransactionTypes"
						/>
						<TextInput isRequired name="transactionNumber" label="Transaction Number" />
						<TextInput
							isReadOnly={isTrial}
							isRequired
							bind:value={credits}
							name="credits"
							label="Credits"
							type="number"
							min={1}
							max={30}
						/>
						<SelectInput
							name="shipmentID"
							label="Transaction Shipment"
							loadMoreUrl="/_api/autocomplete/shipments"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 p-2 lg:col-span-2">
		<h2 class="font-semibold">Other Info</h2>
		<div class="flex flex-col gap-4 pb-8">
			<ToggleInput name="isFromCall" label="From call" />

			<TextareaInput name="notes" label="Add a note" />

			<UserSelectInput
				isRequired
				name="handledByUserID"
				label="Handled By User"
				value={page.data.session.id}
			/>
		</div>
		{#each formState.serverErrors as error (error)}
			<Alert type="error">{error}</Alert>
		{/each}

		<SolidButton type="submit" isLoading={formState.isLoading}>Submit</SolidButton>
	</div>
</form>
