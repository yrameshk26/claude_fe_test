<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { untrack } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import Input from '$lib/components/ui/input.svelte'
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

<div class="relative w-full max-w-md animate-fade-in">
	<!-- Decorative gradient orbs -->
	<div class="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-glow"></div>
	<div class="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500 rounded-full filter blur-3xl opacity-30 animate-glow" style="animation-delay: 1s"></div>
	
	<!-- Main card -->
	<div class="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
		<!-- Shimmer effect overlay -->
		<div class="absolute inset-0 bg-gradient-shine opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
		
		<!-- Card content -->
		<div class="relative p-8 sm:p-10">
			<!-- Logo and Title -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-primary via-purple-500 to-accent rounded-2xl shadow-glow">
					<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h1 class="text-3xl font-display font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text">Welcome Back</h1>
				<p class="text-sm text-gray-400">Sign in to access your account</p>
			</div>

			<!-- Login Form -->
			<form method="POST" use:enhance={onSubmit} class="space-y-5">
				<!-- Email Input -->
				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-gray-300 ml-1">
						Email Address
					</label>
					<div class="relative group">
						<div class="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-focus-within:opacity-50 blur transition duration-300"></div>
						<Input
							id="email"
							type="email"
							name="email"
							bind:value={email}
							placeholder="you@example.com"
							required
							className="relative bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-12 focus:bg-white/10 transition-all duration-300"
						/>
					</div>
				</div>
				
				<!-- Password Input -->
				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-gray-300 ml-1">
						Password
					</label>
					<div class="relative group">
						<div class="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-focus-within:opacity-50 blur transition duration-300"></div>
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							name="password"
							bind:value={password}
							placeholder="••••••••"
							required
							className="relative bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-12 rounded-xl h-12 focus:bg-white/10 transition-all duration-300"
						/>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 rounded-lg hover:bg-white/10"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
								</svg>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>
				
				<!-- Remember me & Forgot password -->
				<div class="flex items-center justify-between">
					<label class="flex items-center space-x-2 cursor-pointer group">
						<input type="checkbox" class="w-4 h-4 bg-white/10 border-white/20 rounded text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all" />
						<span class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
					</label>
					<a
						href="/forgotPassword"
						class="text-sm text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-0.5"
					>
						Forgot password?
					</a>
				</div>
				
				<!-- Submit Button -->
				<Button
					id="loginSubmitButton"
					type="submit"
					variant="gradient"
					size="lg"
					isLoading={formState.isLoading}
					className="w-full text-base font-semibold tracking-wide uppercase"
				>
					{#if formState.isLoading}
						Authenticating...
					{:else}
						Sign In
					{/if}
				</Button>
				
				<!-- Alternative login options -->
				<div class="relative my-6">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-white/10"></div>
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="px-2 text-gray-500 bg-transparent">Or continue with</span>
					</div>
				</div>
				
				<!-- Social login buttons -->
				<div class="grid grid-cols-2 gap-3">
					<Button
						type="button"
						variant="outline"
						size="default"
						className="w-full border-white/10 hover:bg-white/10"
					>
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
							<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
							<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
							<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
						</svg>
						Google
					</Button>
					<Button
						type="button"
						variant="outline"
						size="default"
						className="w-full border-white/10 hover:bg-white/10"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						GitHub
					</Button>
				</div>
				
				<!-- Error Messages -->
				{#each formState.serverErrors as error (error)}
					<Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-300 rounded-xl animate-fade-in">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
						{error}
					</Alert>
				{/each}
			</form>
			
			<!-- Sign up link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-400">
					Don't have an account? 
					<a href="/signup" class="text-primary hover:text-accent transition-colors font-medium">Sign up</a>
				</p>
			</div>
		</div>
	</div>
</div>