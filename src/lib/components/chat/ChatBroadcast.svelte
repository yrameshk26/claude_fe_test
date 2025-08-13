<script lang="ts">
	import { SolidButton } from '$sveltewind/components/buttons'
	import { NewForm } from '$sveltewind/components/forms'
	import { TextareaInput } from '$sveltewind/components/inputs'
	import { Alert } from '$sveltewind/components/display'
	import { UserGroupIcon } from '$icons'
</script>

<NewForm
	label="Broadcast a message"
	action="/_api/chat?/broadcastChatMessage"
	successMessage="Successfully broadcasted a message."
>
	{#snippet trigger({ onclick })}
		<SolidButton {onclick}>
			<UserGroupIcon class="mr-1" />
			Broadcast</SolidButton
		>
	{/snippet}
	{#snippet fields()}
		<div class="flex flex-col gap-6">
			<TextareaInput isRequired name="message" label="Message" />
			<Alert type="warning">This will send a message to all users in your organization.</Alert>
		</div>
	{/snippet}
</NewForm>
