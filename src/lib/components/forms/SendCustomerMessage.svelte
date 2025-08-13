<script lang="ts" module>
	type Props = {
		action: string
		isSingleCustomer?: boolean
		infoMessage?: string
		class?: string
	}
</script>

<script lang="ts">
	import { Alert } from '$sveltewind/components/display'
	import { NewForm } from '$sveltewind/components/forms'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { TextInput, TextareaInput, SelectInput, ToggleInput } from '$sveltewind/components/inputs'
	import { UserIcon, UserGroupIcon } from '$icons'

	let { action, isSingleCustomer = false, infoMessage, class: className = '' }: Props = $props()

	import { page } from '$app/state'
</script>

<NewForm
	label={isSingleCustomer ? 'Send Message' : 'Message Customers'}
	{action}
	successMessage={isSingleCustomer
		? 'Successfully sent a message.'
		: 'Successfully sent the messages.'}
>
	{#snippet trigger({ onclick })}
		{#if isSingleCustomer}
			<SolidButton
				{onclick}
				class={className}
				isDisabled={!(
					page.data.session.isAdmin ||
					page.data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'MESSAGE_SINGLE_CUSTOMER'
					)
				)}
			>
				<UserIcon class="mr-1 size-4" />
				Send Message
			</SolidButton>
		{:else}
			<GhostButton
				{onclick}
				class={className}
				--color-ghostButton="var(--color-blue-600)"
				isDisabled={!(
					page.data.session.isAdmin ||
					page.data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'MESSAGE_MULTIPLE_CUSTOMERS'
					)
				)}
			>
				<UserGroupIcon class="mr-1 size-4" />
				Message Customers
			</GhostButton>
		{/if}
	{/snippet}
	{#snippet fields()}
		<div class="flex flex-col gap-6">
			{#if infoMessage}
				<Alert type="info">{infoMessage}</Alert>
			{/if}
			<SelectInput
				isRequired
				name="type"
				label="Type"
				value="EMAIL"
				options={[
					{ label: 'Email', value: 'EMAIL' },
					{ label: 'SMS', value: 'SMS' },
					{ label: 'Whatsapp', value: 'WHATSAPP' }
				]}
			/>
			<TextInput isRequired name="subject" label="Subject" autofocus />
			<TextareaInput isRequired name="message" label="Message" rows={4} />
			{#if !isSingleCustomer}
				<ToggleInput name="includeInactive" label="Include Inactive Customers" />
				<ToggleInput name="includeExpired" label="Include Expired Customers" />
				<ToggleInput name="skipPromotion" label="Skip Promotion" />
			{/if}
		</div>
	{/snippet}
</NewForm>
