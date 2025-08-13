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
		"border-b border-white/10 transition-all hover:bg-white/5",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tr>