<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		className?: string
		children?: any
	}

	let {
		className = '',
		children,
		...restProps
	}: Props = $props()
</script>

<tbody
	class={cn(
		"[&_tr:last-child]:border-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</tbody>