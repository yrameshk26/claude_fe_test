<script lang="ts" module>
	import type { ChatMessageType } from './ChatSidebar.svelte'

	export type Props = {
		onLoadMore: () => void
		isLastItem: boolean
		chat: ChatMessageType
	}
</script>

<script lang="ts">
	import { page } from '$app/state'
	import { CheckIcon } from '$sveltewind/icons'
	import { twMerge } from 'tailwind-merge'

	let { chat, isLastItem, onLoadMore }: Props = $props()

	function actionWhenInViewport(e: HTMLDivElement) {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				// element in viewport
				if (isLastItem) {
					onLoadMore()
				}
			}
		})

		if (isLastItem) {
			observer.observe(e)
		}
	}
</script>

<div
	use:actionWhenInViewport
	class={twMerge(
		'h-full max-w-lg rounded-xl bg-white px-4 py-4 shadow-md',
		page.data.session.id !== chat.fromUser.id && 'self-start shadow-blue-400',
		page.data.session.id === chat.fromUser.id && 'self-end shadow-green-400'
	)}
>
	<div class="flex min-w-[16rem] items-baseline justify-between">
		<h3 class="max-w-[6rem] truncate text-xs font-medium">
			<span class="text-gray-900">{chat.fromUser.fullName}</span>
		</h3>
		<p class="mt-1 text-xs whitespace-nowrap text-gray-600">
			<time datetime={chat.createdAt} class="flex items-end gap-1">
				{new Date(chat.createdAt).toLocaleString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false
				})}
				{#if chat.fromUser.id === page.data.session.id}
					<span
						class={twMerge(
							'inline-flex items-baseline -space-x-3.5',
							chat.read ? 'text-green-400' : 'text-gray-400'
						)}
					>
						<CheckIcon />
						{#if chat.read}
							<CheckIcon />
						{/if}
					</span>
				{/if}
			</time>
		</p>
	</div>
	<div class="mt-4 space-y-6 text-xs text-gray-800">
		<p>
			{chat.message}
		</p>
	</div>
</div>
