<script lang="ts" module>
	import type { Snippet } from 'svelte'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { Address as AddressType } from '$sveltewind/components/inputs/AddressInput.svelte'

	export type Props = {
		children?: Snippet
	}
</script>

<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import { SolidButton } from '$sveltewind/components/buttons'
	import {
		DateInput,
		TextInput,
		TextareaInput,
		SelectInput,
		AddressInput,
		ToggleInput
	} from '$sveltewind/components/inputs'
	import { Alert } from '$sveltewind/components/display'

	import UserSelectInput from '$lib/components/UserSelectInput.svelte'

	let { children }: Props = $props()

	let addressValue = $state('')
	let address = $state({
		streetNumber: '',
		streetName: '',
		city: '',
		province: '',
		postalCode: '',
		country: ''
	} as AddressType)

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
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
				const newCustomerID = result.data
				goto(`/billing/customers/${newCustomerID}`)
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}
</script>

<form method="POST" use:enhance={onSubmit} class="h-[calc(100%-56px)] overflow-auto">
	{#if children}
		{@render children()}
	{/if}

	<div class="grid gap-4 p-2 lg:grid-cols-7 lg:gap-8">
		<div class="p-2 lg:col-span-5">
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Basic Info</h2>
						<DateInput isRequired name="joinedDate" label="Joined Date" />
						<TextInput isRequired name="fullName" label="Full Name" autofocus />
						<TextInput type="email" name="email" label="Email" />
						<TextInput
							isRequired
							name="pin"
							label="Pin"
							maskitoOptions={{ mask: [/\d/, /\d/, /\d/, /\d/] }}
							value={Math.floor(Math.random() * 10000)
								.toString()
								.padStart(4, '0')}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Primary Phone Number</h2>
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<SelectInput
								isRequired
								name="countryCode"
								label="Country Code"
								hideIcon
								value="+1"
								loadMoreUrl="/_api/autocomplete/countryCodes"
							/>
							<TextInput
								isRequired
								name="primaryPhoneNumber"
								label="Primary Phone Number"
								maskitoOptions={{
									mask: /^\d{0,15}$/
								}}
								classContainer="lg:col-span-2"
							/>
						</div>
					</div>
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Join Info</h2>
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<ToggleInput name="isFromCall" label="Is From Call" />
							<ToggleInput name="isTrial" label="Is Trial" />

							<SelectInput
								name="sourceID"
								label="Source"
								loadMoreUrl="/_api/autocomplete/sources"
							/>
							<SelectInput
								name="languageID"
								label="Language"
								loadMoreUrl="/_api/autocomplete/languages"
							/>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Address</h2>
						<AddressInput
							placeholder="Search for an address"
							bind:value={addressValue}
							onAddressChange={(newAddress) => {
								address = newAddress
								addressValue = ''
							}}
						/>
						<div class="grid grid-cols-6 gap-2">
							<TextInput name="streetNumber" label="Street No." bind:value={address.streetNumber} />
							<TextInput
								name="streetName"
								label="Street Name"
								bind:value={address.streetName}
								classContainer="col-span-3"
							/>
							<TextInput
								name="city"
								label="City"
								bind:value={address.city}
								classContainer="col-span-2"
							/>
						</div>
						<div class="grid grid-cols-3 gap-2">
							<TextInput name="postalCode" label="Postal Code" bind:value={address.postalCode} />
							<TextInput name="province" label="Province" bind:value={address.province} />
							<TextInput name="country" label="Country" bind:value={address.country} />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2">
			<h2 class="font-semibold">Other Info</h2>
			<div class="flex flex-col gap-4 pb-8">
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
	</div>
</form>
