<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	import { page } from '$app/state'

	import { TextInput } from '$sveltewind/components/inputs'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})

	$effect(() => {
		// check if url has query params for otpHash and userID and redirect to login if not
		if (!page.url.searchParams.get('hash') || !page.url.searchParams.get('id')) {
			goto('/login')
		}
	})

	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		// append userID, otpHash and ipapi to formData
		formData.append('id', page.url.searchParams.get('id') as string)
		formData.append('otpHash', page.url.searchParams.get('hash') as string)
		const ipapi = await fetch(`https://ipapi.co/json/`)
			.then((res) => res.json())
			.catch(() =>
				fetch(`https://geolocation-db.com/json/`)
					.then((res) => res.json())
					.catch((error) => error.message)
			)
		formData.append(`ipapi`, JSON.stringify(ipapi))
		return async ({ update, result }) => {
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				update()
			} else if (result.type === 'redirect') {
				update()
				goto(result.location)
			}
		}
	}
</script>

<svelte:head>
	<title>OTP Login | TVUPWEB</title>
</svelte:head>

<form method="POST" use:enhance={onSubmit} class="flex flex-col gap-4 px-2 pt-24">
	<h2 class="text-2xl text-white">OTP Code</h2>
	<p class="text-sm text-gray-400">Enter the 6-digit code sent to your email.</p>

	<TextInput
		isRequired
		type="text"
		inputmode="numeric"
		maskitoOptions={{ mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/] }}
		name="otp"
		classContainer="ring-inset ring-gray-300/50 focus-within:ring-gray-300"
		classLabel="text-gray-200 bg-transparent backdrop-blur-md"
		classInput="bg-transparent text-gray-200 placeholder:text-sm"
	/>

	<SolidButton type="submit" isLoading={formState.isLoading}>SUBMIT</SolidButton>

	{#each formState.serverErrors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
</form>

<a
	href="/login"
	class="flex w-fit items-center gap-1 rounded-md p-1 text-sm text-gray-400 hover:text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
>
	<span>&larr;</span>
	Go back to login
</a>
