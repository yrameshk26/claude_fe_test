<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	interface Props extends HTMLThAttributes {
		className?: string
		children?: any
	}

	let {
		className = '',
		children,
		...restProps
	}: Props = $props()
</script>

<th
	class={cn(
		"h-12 px-4 text-left align-middle font-medium text-gray-300 [&:has([role=checkbox])]:pr-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>