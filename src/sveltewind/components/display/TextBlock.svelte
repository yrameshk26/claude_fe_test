<script lang="ts" module>
	export type Props = {
		children: import('svelte').Snippet
		href?: string
		hideCopy?: boolean
		class?: string
	}
</script>

<script lang="ts">
	import ClipboardButton from '../buttons/ClipboardButton.svelte'
	import { twMerge } from 'tailwind-merge'

	let { children, href, hideCopy = false, class: classes }: Props = $props()

	let isCopyToClipboardVisible = $state(false)

	const id = String(Date.now() + Math.random())
</script>

<div
	class={twMerge('relative flex w-fit items-center justify-start', classes)}
	onmouseenter={() => {
		isCopyToClipboardVisible = true
	}}
	onmouseleave={() => {
		isCopyToClipboardVisible = false
	}}
	role="group"
>
	<div {id}>
		{#if children}
			{#if href}
				<a {href} class={twMerge(classes, 'text-blue-700 hover:underline')}>
					{@render children()}
				</a>
			{:else}
				{@render children()}
			{/if}
		{:else}
			-
		{/if}
	</div>
	{#if !hideCopy}
		<div class={twMerge('absolute -right-6', !isCopyToClipboardVisible && 'opacity-0')}>
			<ClipboardButton containerID={id} />
		</div>
	{/if}
</div>
