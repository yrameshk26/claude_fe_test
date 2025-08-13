<script lang="ts" module>
	type Props = {
		email: string
	}
</script>

<script lang="ts">
	let { email }: Props = $props()

	let interval = $state(0)

	import { dialogState } from '$sveltewind/components/display/Dialog.svelte'
	import { untrack } from 'svelte'

	import { LoadingIcon } from '$sveltewind/icons'
	import { goto } from '$app/navigation'

	const checkLoginApprovalStatus = async () => {
		// fetch login approval status
		try {
			// append ipapi data to the request body
			const ipapi = await fetch(`https://ipapi.co/json/`)
				.then((res) => res.json())
				.catch(() =>
					fetch(`https://geolocation-db.com/json/`)
						.then((res) => res.json())
						.catch((error) => error.message)
				)
			const response = await fetch(`/_api/checkLoginApproval/${email}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ipapi })
			})
			const data = await response.json()
			if (data.success) {
				clearInterval(interval)
				dialogState.closeAll()
				const referrer = data.referrer || '/'
				goto(referrer)
			}
		} catch (error) {
			console.error(error)
		}
	}

	$effect(() => {
		untrack(async () => {
			dialogState.add(dialogSnippet)
			// check login approval status every 5 seconds
			checkLoginApprovalStatus()
			interval = setInterval(checkLoginApprovalStatus, 5000) as unknown as number
		})
		return () => clearInterval(interval)
	})
</script>

{#snippet dialogSnippet()}
	<div
		class="flex w-full max-w-sm flex-col items-center justify-center gap-4 rounded-md bg-white p-4 py-16"
	>
		<LoadingIcon />
		<div>Awaiting for admin login approval...</div>
	</div>
{/snippet}
