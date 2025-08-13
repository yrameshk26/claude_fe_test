<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'
	import { chatState } from './ChatSidebar.svelte'
	import { ChatIcon } from '$icons'

	import { page } from '$app/state'

	let unreadChatCount = $derived(
		chatState.conversations.reduce((acc, conversation) => {
			if (
				conversation.lastChat?.toUser.id === page.data.session.id &&
				!conversation.lastChat?.read
			) {
				acc++
			}
			return acc
		}, 0)
	)
</script>

<GhostButton
	onclick={() => {
		chatState.isOpen = !chatState.isOpen
	}}
	class="p-1 text-xs text-white  hover:bg-gray-800/50 focus-visible:bg-gray-700 lg:px-4 lg:py-3"
>
	<div class="relative">
		<ChatIcon class="lg:mr-1" />
		{#if unreadChatCount}
			<div class="absolute -top-3 -right-2 text-center text-xs">
				<span
					class="relative inline-flex size-5 justify-center rounded-full bg-orange-500 p-0.5 text-white"
					>{unreadChatCount}</span
				>
			</div>
		{/if}
	</div>
	<span class="sr-only lg:not-sr-only">Chat</span>
</GhostButton>
