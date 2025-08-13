<script lang="ts" module>
	export type Props = {
		service: {
			id: string
			credits: number
			isTrial: boolean
			inactive: boolean
			putOnHold: boolean
			expiryDate: string
		}
		isInline?: boolean
	}
</script>

<script lang="ts">
	const { service, isInline = false }: Props = $props()

	import { NewForm, ConfirmForm } from '$sveltewind/components/forms'
	import { DateInput } from '$sveltewind/components/inputs'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { CalendarIcon } from '$sveltewind/icons'
	import { TopupIcon } from '$icons'

	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'

	const lockServiceTopup = () => {
		fetch('/_api/lockServiceTopup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				serviceID: service.id
			})
		})
	}

	const unlockServiceTopup = () => {
		fetch('/_api/unlockServiceTopup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				serviceID: service.id
			})
		})
	}

	let canEdit = $derived(
		!service.inactive && !service.putOnHold && !service.isTrial && service.credits >= 1
	)
</script>

<div class={twMerge('flex items-center justify-center gap-2', isInline ? 'flex-row' : 'flex-col')}>
	<ConfirmForm
		label="Topup Service"
		action={`/billing/services/${service.id}?/topupService`}
		successMessage="Successfully topped up service."
		autoSubmit
	>
		{#snippet trigger({ onclick })}
			{#if isInline}
				<SolidButton
					{onclick}
					class="p-1"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'TOP_UP'
						)
					) || !canEdit}
					hideDisabledIcon
				>
					<TopupIcon />
					<span class="sr-only">Topup</span>
				</SolidButton>
			{:else}
				<SolidButton
					{onclick}
					class="w-full"
					--color-solidButton="var(--color-teal-600)"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'TOP_UP'
						)
					) || !canEdit}
					hideDisabledIcon
				>
					<TopupIcon class="mr-1" />
					<span>Topup</span>
				</SolidButton>
			{/if}
		{/snippet}
	</ConfirmForm>

	<NewForm
		label="Topup Service with Expiry Date"
		action={`/billing/services/${service.id}?/topupService`}
		successMessage="Successfully topped up service."
		onClose={() => {
			unlockServiceTopup()
		}}
	>
		{#snippet trigger({ onclick })}
			{#if isInline}
				<SolidButton
					onclick={() => {
						lockServiceTopup()
						onclick()
					}}
					class="p-1"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'SPECIAL_TOP_UP'
						)
					) || !canEdit}
					hideDisabledIcon
				>
					<CalendarIcon />
					<span class:sr-only={isInline}>Topup with Expiry</span>
				</SolidButton>
			{:else}
				<SolidButton
					class="w-full"
					--color-solidButton="var(--color-teal-600)"
					onclick={() => {
						lockServiceTopup()
						onclick()
					}}
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'SPECIAL_TOP_UP'
						)
					) || !canEdit}
					hideDisabledIcon
				>
					<CalendarIcon class="mr-1" />
					<span>Topup with Expiry</span>
				</SolidButton>
			{/if}
		{/snippet}

		{#snippet fields()}
			<div class="flex min-h-72 flex-col gap-6">
				<DateInput
					isRequired
					name="expiryDate"
					label="Expiry Date"
					value={new Date(
						new Date(service.expiryDate).setMonth(new Date(service.expiryDate).getMonth() + 1)
					).toLocaleDateString('en-CA')}
					autofocus
				/>
			</div>
		{/snippet}
	</NewForm>
</div>
