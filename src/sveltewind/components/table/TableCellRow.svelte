<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
		class?: string
	}
</script>

<script lang="ts">
	let { children, class: classes }: Props = $props()

	import { twMerge } from 'tailwind-merge'
</script>

<tr
	class={twMerge(
		'hover:bg-slate-200/50 [&>*]:border-slate-200 [&>*:first-child]:border-l-2 [&>*:last-child]:border-r-2',
		classes
	)}
>
	{#if children}
		{@render children()}
	{/if}
</tr>
