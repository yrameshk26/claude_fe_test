<script lang="ts">
	import { tick } from 'svelte'
	import { Alert } from '$sveltewind/components/display'
	import { GhostButton, SolidButton } from '$sveltewind/components/buttons'
	import { NewForm } from '$sveltewind/components/forms'
	import { PhoneIcon } from '$icons'

	import { WarningToast } from '$sveltewind/components/toasts'
	import { toastState } from '$sveltewind/components/display/Toast.svelte'

	import { page } from '$app/state'

	let storePhoneNumbers = $state([]) as {
		label: string
		value: string
		metadata: {
			name: string
		}
	}[]
	let error = $state('')
	let selectedStorePhoneNoID = $state('')

	const loadStorePhoneNumbers = () => {
		error = ''
		fetch('/_api/autocomplete/storePhoneNumbers')
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					error = data.errors
				} else {
					storePhoneNumbers = data
				}
			})
			.catch((err) => (error = err.message))
	}

	$effect(() => {
		loadStorePhoneNumbers()
	})

	let duration = $state(0)

	const updateDuration = () => {
		duration = new Date().getTime() - new Date(page.data.session.activeCall.startTime).getTime()
	}

	const formatDuration = (duration: number) => {
		const seconds = Math.floor((duration / 1000) % 60)
		const minutes = Math.floor((duration / (1000 * 60)) % 60)
		const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}

	$effect(() => {
		if (!page.data.session.activeCall) return
		updateDuration()
		const interval = setInterval(updateDuration, 1000)
		return () => clearInterval(interval)
	})

	$effect(() => {
		if (!page.data.session.activeCall) return
		// show toast every 5 mins while there is an active call
		const interval = setInterval(
			() => {
				toastState.add(WarningToast, {
					snippetProps: {
						message: `You have an active call in progress for ${formatDuration(duration)}`
					},
					position: 'top-center',
					timeout: 100000
				})
			},
			5 * 60 * 1000
		)
		return () => clearInterval(interval)
	})
</script>

{#if page.data.session.activeCall}
	<GhostButton
		href="/calltrack/callRecords/{page.data.session.activeCall.id}"
		class="px-4 py-3 text-xs text-white hover:bg-gray-800/50 focus-visible:bg-gray-700"
	>
		<div class="relative">
			<PhoneIcon />
			<div class="absolute -top-2 -right-1 text-center text-xs">
				<span class="absolute inline-flex animate-ping">
					<span class="inline-flex size-4 rounded-full bg-green-400 opacity-75"> </span>
				</span>
				<span
					class="relative inline-flex size-4 justify-center rounded-full bg-green-500 p-0.5 text-white"
				></span>
			</div>
		</div>
		<span class="tabular-nums">{formatDuration(duration)}</span>
	</GhostButton>
{:else if page.data.session.isAdmin || page.data.session.permissions.find((p) => p.app === 'CALLTRACK' && p.permissionType === 'ADD_CALL_RECORD')}
	<NewForm
		action="/calltrack/callRecords/new"
		successMessage="Successfully started a new call record."
		label="Start a new call record"
		additionalFormData={{ storePhoneNumberID: selectedStorePhoneNoID }}
		classForm="max-w-3xl"
		classSubmitButton="hidden"
	>
		{#snippet trigger({ onclick })}
			<GhostButton
				{onclick}
				class="p-1 text-xs text-white hover:bg-gray-800/50 focus-visible:bg-gray-700 lg:px-4 lg:py-3"
			>
				<PhoneIcon class="lg:mr-1" />
				<span class="sr-only lg:not-sr-only">Call Record</span>
			</GhostButton>
		{/snippet}
		{#snippet fields()}
			{#if error}
				<Alert type="error" class="flex w-full items-center justify-between">
					{error}
					<SolidButton onclick={loadStorePhoneNumbers} --color-solidButton="var(--color-slate-600)">
						Retry
					</SolidButton>
				</Alert>
			{:else}
				<div class="grid gap-6 lg:grid-cols-4">
					{#each storePhoneNumbers as { label, value, metadata: { name } } (value)}
						<GhostButton
							type="submit"
							class="bg-slate-100 text-slate-800 hover:bg-slate-300 focus-visible:bg-slate-300"
							onclick={async () => {
								selectedStorePhoneNoID = value
								await tick()
							}}
						>
							<div class="flex flex-col gap-2 text-center">
								<div>{label}</div>
								<div>{name}</div>
							</div>
						</GhostButton>
					{:else}
						<Alert type="error" class="w-full">No store phone numbers found.</Alert>
					{/each}
				</div>
			{/if}
		{/snippet}
	</NewForm>
{/if}
