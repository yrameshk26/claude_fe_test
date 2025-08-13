<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
		class?: string
		classHead?: string
	}
</script>

<script lang="ts">
	let { children, class: classes, classHead }: Props = $props()

	import { twMerge } from 'tailwind-merge'
</script>

<thead class={twMerge('sticky top-0 z-20 bg-slate-200', classHead)}>
	<tr class={twMerge('[&>*:first-child]:border-l-2 [&>*:last-child]:border-r-2', classes)}>
		{#if children}
			{@render children()}
		{/if}
	</tr>
</thead>
