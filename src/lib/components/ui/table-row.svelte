<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	interface Props extends HTMLAttributes<HTMLTableRowElement> {
		className?: string
		children?: any
	}

	let {
		className = '',
		children,
		...restProps
	}: Props = $props()
</script>

<tr
	class={cn(
		"border-b border-slate-700 transition-all hover:bg-slate-800/50",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>