<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	import { dialogState } from '$sveltewind/components/display/Dialog.svelte'
	import { LoadingIcon } from '$sveltewind/icons'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'

	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import { untrack } from 'svelte'

	const INACTIVITY_TIMEOUT_CHECK_INTERVAL = 1000 * 60 * 5 // 5 minutes
	const INACTIVITY_TIMEOUT_THRESHOLD = 1000 * 60 * 15 // 15 minutes
	const INACTIVITY_LOGOUT_TIMER = 1000 * 60 * 5 // 5 minutes

	// Check every INACTIVITY_TIMEOUT_CHECK_INTERVAL minutes if the last active time is more than INACTIVITY_TIMEOUT_THRESHOLD minutes.
	// If it is, then show the inactivity popup and start the logoutTimer for INACTIVITY_LOGOUT_TIMER minutes.
	// On submit of the continue session form, stop the logoutTimer and restart the checkSessionInactivity inactivityInterval.
	// On submit of the logout button, stop all timers and redirect to logout page.

	let inactivityInterval = $state(0)
	let logoutTimer = $state(0)

	const logout = () => {
		clearTimeout(logoutTimer)
		untrack(() => {
			clearInterval(inactivityInterval)
		})
		dialogState.closeAll()
		const referrer = encodeURIComponent(page.url.href)
		goto(`/logout?referrer=${referrer}&error=Your session has expired. Please log in again.`)
	}

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	const onSubmit: SubmitFunction = async () => {
		formState.isLoading = true
		formState.serverErrors = []
		return async ({ result, update }) => {
			formState.isLoading = false
			await update()
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				// stop the logout logoutTimer and restart the checkSessionInactivity inactivityInterval
				clearTimeout(logoutTimer)
				inactivityInterval = setInterval(
					checkSessionInactivity,
					INACTIVITY_TIMEOUT_CHECK_INTERVAL
				) as unknown as number
				dialogState.close()
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}

	const checkSessionInactivity = () => {
		// get TVUPWEB_LAST_ACTIVE cookie value
		const TVUPWEB_LAST_ACTIVE = document.cookie
			.split('; ')
			.find((row) => row.startsWith('TVUPWEB_LAST_ACTIVE'))
		const lastActiveTime = TVUPWEB_LAST_ACTIVE ? parseInt(TVUPWEB_LAST_ACTIVE.split('=')[1]) : 0
		const currentTime = new Date().getTime()
		const timeDifference = currentTime - lastActiveTime
		if (timeDifference > INACTIVITY_TIMEOUT_THRESHOLD) {
			// if last active time is more than INACTIVITY_TIMEOUT_THRESHOLD, show inactivity popup
			dialogState.add(dialogSnippet)
			// stop the checkSessionInactivity inactivityInterval and start the logout logoutTimer
			untrack(() => {
				clearInterval(inactivityInterval)
			})
			logoutTimer = setTimeout(logout, INACTIVITY_LOGOUT_TIMER) as unknown as number
		}
	}

	$effect(() => {
		inactivityInterval = setInterval(
			checkSessionInactivity,
			INACTIVITY_TIMEOUT_CHECK_INTERVAL
		) as unknown as number
		return () => clearInterval(inactivityInterval)
	})
</script>

{#snippet dialogSnippet()}
	<div
		class="flex w-full max-w-sm flex-col items-center justify-center gap-4 rounded-md bg-white p-4 py-4"
	>
		<LoadingIcon />
		<div class="text-lg font-bold">Session Inactivity</div>
		<Alert type="warning">
			You have been inactive for too long and will be logged out automatically in 5 minutes.
		</Alert>
		<div class="flex w-full justify-between gap-2">
			<form method="POST" action="/?/refreshMySession" use:enhance={onSubmit}>
				<SolidButton type="submit" isLoading={formState.isLoading}>Continue Session</SolidButton>
			</form>
			<SolidButton onclick={logout} --color-solidButton="var(--color-red-600)">Logout</SolidButton>
		</div>
	</div>
{/snippet}
