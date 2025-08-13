<script lang="ts" module>
	import type { ConversationType } from './ChatSidebar.svelte'

	export type Props = {
		conversation: ConversationType
		isActive: boolean
	}
</script>

<script lang="ts">
	import { page } from '$app/state'

	import UserAvatar from '../UserAvatar.svelte'
	import { CheckIcon } from '$sveltewind/icons'
	import { twMerge } from 'tailwind-merge'

	$effect(() => {
		if (isActive && conversation.lastChat && !conversation.lastChat.read) {
			conversation.lastChat.read = true
		}
	})

	let { conversation = $bindable(), isActive }: Props = $props()
</script>

<div class="relative w-full">
	<div class="flex items-center justify-between space-x-3">
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<UserAvatar
					fullName={conversation.otherUser.fullName}
					imageUrl={conversation.otherUser.imageUrl}
					class="size-12"
				/>
				<h2 class="block flex-1 truncate overflow-hidden focus:outline-none">
					<p class="truncate text-sm font-semibold">
						{conversation.otherUser.fullName}
					</p>
				</h2>
			</div>
		</div>
		{#if conversation.lastChat}
			<time
				datetime={conversation.lastChat.createdAt}
				class="flex-shrink-0 text-xs whitespace-nowrap"
			>
				{new Date(conversation.lastChat.createdAt).toLocaleString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false
				})}
			</time>
		{/if}
	</div>
	<div class="mt-1">
		<div class="line-clamp-2 flex items-end gap-1 truncate text-xs">
			{#if conversation.lastChat}
				{#if conversation.lastChat.fromUser.id !== page.data.session.id && !conversation.lastChat.read}
					<div class="absolute top-1.5 right-0 -mt-2 -mr-2 flex">
						<span class="absolute inline-flex animate-ping">
							<span class="inline-flex h-4 w-4 rounded-full bg-orange-400 opacity-75"> </span>
						</span>
						<span class="relative inline-flex h-4 w-4 rounded-full bg-orange-500"> </span>
					</div>
				{/if}
				{#if conversation.lastChat.fromUser.id === page.data.session.id}
					<span
						class={twMerge(
							'inline-flex items-baseline -space-x-3.5',
							conversation.lastChat.read ? 'text-green-400' : 'text-gray-400'
						)}
					>
						<CheckIcon />
						{#if conversation.lastChat.read}
							<CheckIcon />
						{/if}
					</span>
				{/if}
				{conversation.lastChat.message}
			{:else}
				No messages yet
			{/if}
		</div>
	</div>
</div>
