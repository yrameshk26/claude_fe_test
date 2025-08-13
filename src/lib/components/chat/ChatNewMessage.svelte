<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { chatState } from './ChatSidebar.svelte'

	import { TextInput } from '$sveltewind/components/inputs'
	import { SolidButton } from '$sveltewind/components/buttons'

	import { enhance } from '$app/forms'

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})

	$effect(() => {
		const inputElement = document.getElementById('message-input') as HTMLInputElement
		inputElement?.focus()
	})

	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		formData.append('conversationID', chatState.chatData.conversationID as string)
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			const inputElement = document.getElementById('message-input') as HTMLInputElement
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				const newChat = result.data as (typeof chatState)['chatData']['chats']['data'][0]
				chatState.chatData.chats.data = [newChat, ...chatState.chatData.chats.data]
				if (inputElement) inputElement.value = ''
			}
			inputElement?.focus()
		}
	}
</script>

<form
	method="POST"
	action="/_api/chat/{chatState.chatData.toUserID}/?/sendChatMessage"
	use:enhance={onSubmit}
	class="mt-2 px-2"
>
	<TextInput
		id="message-input"
		name="message"
		placeholder="Type a message"
		isRequired
		classContainer="py-4"
		classInput="text-base placeholder:text-base"
		error={formState.serverErrors[0] ?? ''}
	>
		{#snippet rightChildren()}
			<SolidButton type="submit" isLoading={formState.isLoading} class="mr-2">
				<span class="mr-2">Send</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
				>
					<path
						d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"
					/>
				</svg>
			</SolidButton>
		{/snippet}
	</TextInput>
</form>
