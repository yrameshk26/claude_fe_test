<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	import { TextInput } from '$sveltewind/components/inputs'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[],
		serverMessage: ''
	})

	const onSubmit: SubmitFunction = async () => {
		formState.isLoading = true
		formState.serverErrors = []
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
	<title>Forgot Password | TVUPWEB</title>
</svelte:head>

<form method="POST" use:enhance={onSubmit} class="flex flex-col gap-4 px-2 pt-24">
	<h2 class="text-2xl text-white">Forgot Password</h2>
	<p class="text-sm text-gray-400">
		Don't worry! Just fill in your email and we'll send you a link to reset your password.
	</p>
	<TextInput
		isRequired
		type="email"
		name="email"
		placeholder="Email"
		classContainer="ring-inset ring-gray-300/50 focus-within:ring-gray-300"
		classLabel="text-gray-200 bg-transparent backdrop-blur-md"
		classInput="bg-transparent text-gray-200 placeholder:text-sm"
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
