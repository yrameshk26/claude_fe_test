<script lang="ts" module>
	type Props = {
		callRecord: Record<string, any>
		class?: string
	}
</script>

<script lang="ts">
	import { Alert } from '$sveltewind/components/display'
	import { ConfirmForm } from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { PhoneIcon } from '$icons'
	import { twMerge } from 'tailwind-merge'

	let { callRecord, class: classes }: Props = $props()

	let duration = $state(0)

	const updateDuration = () => {
		duration = new Date().getTime() - new Date(callRecord.startTime).getTime()
	}

	const formatDuration = (duration: number) => {
		const seconds = Math.floor((duration / 1000) % 60)
		const minutes = Math.floor((duration / (1000 * 60)) % 60)
		const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
	}

	$effect(() => {
		updateDuration()
		const interval = setInterval(updateDuration, 1000)
		return () => clearInterval(interval)
	})
</script>

<ConfirmForm
	label="End Call"
	action={`/calltrack/callRecords/${callRecord.id}?/updateCallRecordEndTime`}
	additionalFormData={{ endTime: new Date().toISOString() }}
	successMessage="Successfully ended call."
>
	{#snippet trigger({ onclick })}
		<SolidButton
			class={twMerge('w-full text-xs', classes)}
			{onclick}
			--color-solidButton="var(--color-red-600)"
		>
			<PhoneIcon class="mr-1 size-4" />
			<span class="tabular-nums">{formatDuration(duration)}</span>
		</SolidButton>
	{/snippet}
	{#snippet fields()}
		<Alert type="warning" class="w-full">
			Are you sure you want to end this call? <strong>{formatDuration(duration)}</strong>
		</Alert>
	{/snippet}
</ConfirmForm>
