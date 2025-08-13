<script lang="ts" module>
	import type { Snippet } from 'svelte'
	import type { SubmitFunction } from '@sveltejs/kit'

	export type Props = {
		children?: Snippet
	}
</script>

<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'New Staff'

	import { Tabs } from '$sveltewind/components/display'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import { SolidButton } from '$sveltewind/components/buttons'
	import { TextInput, PasswordInput, SelectInput, ToggleInput } from '$sveltewind/components/inputs'
	import { Alert } from '$sveltewind/components/display'

	let password = $state('')
	let confirmPassword = $state('')

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	const onSubmit: SubmitFunction = async ({ formData }) => {
		if (password !== confirmPassword) {
			formState.serverErrors = ['Make sure your password and confirm password match.']
			return
		}
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
				const newStaffID = result.data
				goto(`/management/staffs/${newStaffID}`)
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}
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
					<TextInput isRequired type="email" name="email" label="Email" />
					<TextInput isRequired name="fullName" label="Full Name" autofocus />
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
					<h2 class="font-semibold">Password</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<PasswordInput
							isRequired
							name="password"
							label="Password"
							bind:value={password}
							classContainer="h-fit"
						/>
						<PasswordInput
							isRequired
							name="confirmPassword"
							label="Confirm Password"
							bind:value={confirmPassword}
							error={password !== confirmPassword ? 'Passwords do not match' : ''}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 p-2 lg:col-span-2">
		<h2 class="font-semibold">Other Info</h2>
		<div class="flex flex-col gap-4 pb-8">
			<ToggleInput isDisabled={!page.data.session.isAdmin} name="isAdmin" label="Is Admin" />
		</div>
		{#each formState.serverErrors as error (error)}
			<Alert type="error">{error}</Alert>
		{/each}

		<SolidButton type="submit" isLoading={formState.isLoading}>Submit</SolidButton>
	</div>
</form>
