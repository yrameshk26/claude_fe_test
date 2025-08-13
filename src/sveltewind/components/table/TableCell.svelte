<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
		colspan?: number
		class?: string
	}
</script>

<script lang="ts">
	let { children, class: classes, colspan }: Props = $props()

	import { twMerge } from 'tailwind-merge'
</script>

<td
	{colspan}
	class={twMerge(
		'border-b border-slate-200 px-2.5 py-0.5 text-xs text-pretty text-black!',
		classes
	)}
>
	{#if children}
		{@render children()}
	{/if}
</td>
