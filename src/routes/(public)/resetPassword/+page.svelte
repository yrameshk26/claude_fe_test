<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	import { page } from '$app/state'

	import { PasswordInput } from '$sveltewind/components/inputs'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[],
		serverMessage: '',
		values: {
			newPassword: '',
			confirmPassword: ''
		},
		errors: {
			confirmPassword: ''
		}
	})

	$effect(() => {
		// check if url has query params for hash and userID and redirect to login if not
		if (!page.url.searchParams.get('hash') || !page.url.searchParams.get('id')) {
			goto('/login')
		}
	})

	const onSubmit: SubmitFunction = async ({ formData, cancel }) => {
		if (formState.values.newPassword !== formState.values.confirmPassword) {
			formState.errors.confirmPassword = 'Passwords do not match'
			cancel()
			return
		}
		formState.errors.confirmPassword = ''

		formState.isLoading = true
		formState.serverErrors = []
		// append userID, hash and fingerprint to formData
		formData.append('id', page.url.searchParams.get('id') as string)
		formData.append('hash', page.url.searchParams.get('hash') as string)
		return async ({ update, result }) => {
			formState.isLoading = false
			if (result.type === 'success') {
				update()
				formState.serverMessage = result.data?.message
			} else if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'redirect') {
				update()
				goto(result.location)
			}
		}
	}
</script>

<svelte:head>
	<title>Reset Password | TVUPWEB</title>
</svelte:head>

<form method="POST" use:enhance={onSubmit} class="flex flex-col gap-4 px-2 pt-24">
	<h2 class="text-2xl text-white">Reset Password</h2>
	<PasswordInput
		isRequired
		name="newPassword"
		placeholder="New Password"
		bind:value={formState.values.newPassword}
		classContainer="ring-inset ring-gray-300/50 focus-within:ring-gray-300"
		classLabel="text-gray-200 bg-transparent backdrop-blur-md"
		classInput="bg-transparent text-gray-200 placeholder:text-sm"
	/>

	<PasswordInput
		isRequired
		name="confirmPassword"
		placeholder="Confirm Password"
		bind:value={formState.values.confirmPassword}
		error={formState.errors.confirmPassword}
		classContainer="ring-inset ring-gray-300/50 focus-within:ring-gray-300"
		classLabel="text-gray-200 bg-transparent backdrop-blur-md"
		classInput="bg-transparent text-gray-300 placeholder:text-sm"
	/>

	<SolidButton type="submit" isLoading={formState.isLoading}>SUBMIT</SolidButton>

	{#each formState.serverErrors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}

	{#if formState.serverMessage}
		<Alert type="success">{formState.serverMessage}</Alert>
	{/if}
</form>

<a
	href="/login"
	class="flex w-fit items-center gap-1 rounded-md p-1 text-sm text-gray-400 hover:text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
>
	<span>&larr;</span>
	Go back to login
</a>
