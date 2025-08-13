<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
	}
</script>

<script lang="ts">
	let { children }: Props = $props()

	import { ClipboardButton } from '../buttons'

	const containerID = Math.random().toString(36).substring(2, 15)
</script>

<div
	class="relative w-fit max-w-full overflow-x-hidden rounded-lg bg-slate-800/90 px-4 text-xs text-white"
>
	<div class="absolute right-0">
		<ClipboardButton {containerID} --color-ghostButton="var(--color-slate-300)" />
	</div>
	<pre id={containerID} class="overflow-auto">
		{#if children}
			{@render children()}
		{/if}
	</pre>
</div>
