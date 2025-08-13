<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Alert from '$lib/components/ui/alert.svelte'

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
	let password = $state('')
	let showPassword = $state(false)

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

<div class="w-full max-w-md">
	<Card className="bg-white/10 backdrop-blur-md border-white/20">
		<CardHeader>
			<CardTitle tag="h2" className="text-2xl text-white text-center">Login</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" use:enhance={onSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="email" className="text-gray-200">Email</Label>
					<Input
						id="email"
						type="email"
						name="email"
						bind:value={email}
						placeholder="Enter your email"
						required
						className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
					/>
				</div>
				
				<div class="space-y-2">
					<Label for="password" className="text-gray-200">Password</Label>
					<div class="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							name="password"
							bind:value={password}
							placeholder="Enter your password"
							required
							className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
						/>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>
				
				<div class="flex justify-end">
					<a
						href="/forgotPassword"
						class="text-sm text-gray-300 hover:text-white transition-colors"
					>
						Forgot password?
					</a>
				</div>
				
				<Button
					id="loginSubmitButton"
					type="submit"
					isLoading={formState.isLoading}
					className="w-full"
				>
					AUTHENTICATE
				</Button>
				
				{#each formState.serverErrors as error (error)}
					<Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
						{error}
					</Alert>
				{/each}
			</form>
		</CardContent>
	</Card>
</div>
