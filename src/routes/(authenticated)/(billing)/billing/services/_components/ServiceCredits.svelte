<script lang="ts" module>
	export type Props = {
		service: {
			id: string
			credits: number
			isTrial: boolean
			inactive: boolean
			putOnHold: boolean
			macID?: string
			accountNumber?: string
			serviceType: {
				id: string
				name: string
				color: string
			}
			isFromCall?: boolean
		}
		isInline?: boolean
		children?: import('svelte').Snippet
	}
</script>

<script lang="ts">
	import { NewForm } from '$sveltewind/components/forms'
	import { DateInput, SelectInput, TextInput, TextareaInput } from '$sveltewind/components/inputs'
	import { GhostButton, SolidButton } from '$sveltewind/components/buttons'
	import { MinusIcon, PlusIcon } from '$sveltewind/icons'

	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import UserSelectInput from '$lib/components/UserSelectInput.svelte'

	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'

	let { service, isInline = false, children }: Props = $props()
	let transactionType = $state('')

	let canEdit = $derived(!service.inactive && !service.putOnHold && !service.isTrial)
</script>

{#snippet formInputs()}
	<div class="flex flex-col gap-6">
		<div class="mx-auto -my-3 grid grid-cols-2 items-center justify-between text-xs">
			<div>Service Type</div>
			<div><ServiceTypeLink serviceType={service.serviceType} /></div>
			<div>MAC / Acc No.</div>
			<div class="min-w-24">{service.macID || service.accountNumber}</div>
			<div class="pt-1">Is From Call</div>
			<div class="pt-1">{service.isFromCall ? 'Yes' : 'No'}</div>
		</div>
		<DateInput label="Transaction Date" value={new Date()} isRequired name="transactionDate" />
		<UserSelectInput
			isRequired
			name="handledByUserID"
			label="Handled By User"
			value={page.data.session.id}
		/>
		<SelectInput
			isRequired
			name="transactionType"
			label="Transaction Type"
			loadMoreUrl="/_api/autocomplete/billingTransactionTypes"
			bind:value={transactionType}
		/>
		<TextInput
			autofocus
			isRequired={transactionType !== 'REVERSE'}
			name="transactionNumber"
			label="Transaction Number"
		/>
		<TextInput isRequired name="credits" value="1" label="Credits" type="number" min={1} max={30} />
		<TextareaInput name="notes" label="Notes" />
	</div>
{/snippet}

{#snippet removeCreditsSnippet()}
	<NewForm
		label="Remove credits from Service"
		action={`/billing/services/${service.id}?/decrementServiceCredits`}
		successMessage="Successfully removed credits from service."
	>
		{#snippet trigger({ onclick })}
			{#if isInline}
				<GhostButton
					{onclick}
					class="h-fit justify-between p-1"
					--color-ghostButton="var(--color-red-600)"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'REMOVE_CREDITS'
						)
					) ||
						!canEdit ||
						service.credits === 0}
					hideDisabledIcon
				>
					<MinusIcon />
					<span class="sr-only">Remove credits</span>
				</GhostButton>
			{:else}
				<SolidButton
					{onclick}
					--color-solidButton="var(--color-red-600)"
					class="justify-between"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'REMOVE_CREDITS'
						)
					) ||
						!canEdit ||
						service.credits === 0}
					hideDisabledIcon
				>
					<MinusIcon class="mr-1" />
					<span>Remove credits</span>
				</SolidButton>
			{/if}
		{/snippet}
		{#snippet fields()}
			{@render formInputs()}
		{/snippet}
	</NewForm>
{/snippet}

{#snippet addCreditsSnippet()}
	<NewForm
		label="Add credits to Service"
		action={`/billing/services/${service.id}?/incrementServiceCredits`}
		successMessage="Successfully added credits to service."
	>
		{#snippet trigger({ onclick })}
			{#if isInline}
				<GhostButton
					{onclick}
					class="h-fit justify-between p-1"
					--color-ghostButton="var(--color-green-600)"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'ADD_CREDITS'
						)
					) || !canEdit}
					hideDisabledIcon
				>
					<PlusIcon />
					<span class="sr-only">Add credits</span>
				</GhostButton>
			{:else}
				<SolidButton
					{onclick}
					--color-solidButton="var(--color-green-600)"
					class="justify-between"
					isDisabled={!(
						page.data.session.isAdmin ||
						page.data.session.permissions.find(
							(p) => p.app === 'BILLING' && p.permissionType === 'ADD_CREDITS'
						)
					) || !canEdit}
					hideDisabledIcon
				>
					<PlusIcon class="mr-1" />
					<span>Add credits</span>
				</SolidButton>
			{/if}
		{/snippet}
		{#snippet fields()}
			{@render formInputs()}
		{/snippet}
	</NewForm>
{/snippet}

<div
	class={twMerge('flex items-center gap-0.5', !isInline && 'gap-4', isInline && 'justify-center')}
>
	<!-- {#if canEdit} -->
	{#if !isInline}
		<div class="flex w-full items-center gap-4">
			{#if children}
				{@render children()}
			{/if}
			<div class="flex w-full flex-col gap-2">
				{@render addCreditsSnippet()}
				{@render removeCreditsSnippet()}
			</div>
		</div>
	{:else}
		{@render removeCreditsSnippet()}

		{#if children}
			{@render children()}
		{/if}

		{@render addCreditsSnippet()}
	{/if}
	<!-- {/if} -->
</div>
