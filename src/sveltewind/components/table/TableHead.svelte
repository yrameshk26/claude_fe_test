<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
		sortBy?: string
		class?: string
	}
</script>

<script lang="ts">
	import { Sort } from '../filters'
	import { twMerge } from 'tailwind-merge'

	import { printerState } from './TablePrint.svelte'
	let { children, sortBy, class: classes }: Props = $props()
</script>

<th
	class={twMerge(
		'relative min-w-48 border-t-2 border-r border-b border-slate-300 px-3 py-1.5 text-left text-sm font-semibold text-gray-900 first:rounded-tl-md last:rounded-tr-md',
		classes
	)}
>
	{#if children}
		{@render children()}
	{/if}
	{#if sortBy && !printerState.isPrinting}
		<span class="absolute top-1/2 right-0 mr-4 h-auto w-4 -translate-y-1/2">
			<Sort {sortBy} class="p-1" />
		</span>
	{/if}
</th>
