<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import { TextInput, PasswordInput } from '$sveltewind/components/inputs'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'

	import PollLoginApproval from './_components/PollLoginApproval.svelte'

	let pollLoginApproval = $state(false)

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})

	$effect(() => {
		// remove the error query param from the url
		if (page.url.searchParams.get('error')) {
			formState.serverErrors = [page.url.searchParams.get('error') as string]
			const url = new URL(page.url)
			url.searchParams.delete('error')
			untrack(() => {
				goto(url.toString(), { noScroll: true, replaceState: true })
			})
		}
	})

	let email = $state('')

	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		// append ipapi data to the form data
		let ipapi = await fetch(`https://ipapi.co/json/`)
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
				if (result.data?.errors[0].includes('Request has been sent to your administrators')) {
					pollLoginApproval = true
				}
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
	<title>Login | TVUPWEB</title>
</svelte:head>

{#if pollLoginApproval}
	<PollLoginApproval {email} />
{/if}

<form method="POST" use:enhance={onSubmit} class="flex flex-col gap-4 px-2 pt-24">
	<h2 class="text-2xl text-white">Login</h2>
	<TextInput
		isRequired
		type="email"
		name="email"
		bind:value={email}
		placeholder="Email"
		classContainer="ring-inset ring-gray-300/50 focus-within:ring-gray-300"
		classLabel="text-gray-200 bg-transparent backdrop-blur-md"
		classInput="bg-transparent text-gray-200 placeholder:text-sm"
	/>
	<PasswordInput
		isRequired
		name="password"
		placeholder="Password"
		classContainer="ring-inset ring-gray-300/50 focus-within:ring-gray-300"
		classLabel="text-gray-200 bg-transparent backdrop-blur-md"
		classInput="bg-transparent text-gray-200 placeholder:text-sm"
	/>
	<div class="-mt-2 w-full pb-4 text-right">
		<a
			href="/forgotPassword"
			class="rounded-md p-1 text-sm text-gray-400 hover:text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
		>
			Forgot password?
		</a>
	</div>

	<SolidButton id="loginSubmitButton" type="submit" isLoading={formState.isLoading}>
		AUTHENTICATE
	</SolidButton>

	{#each formState.serverErrors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
</form>
