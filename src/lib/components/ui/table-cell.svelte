<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	interface Props extends HTMLTdAttributes {
		className?: string
		children?: any
	}

	let {
		className = '',
		children,
		...restProps
	}: Props = $props()
</script>

<td
	class={cn(
		"p-4 align-middle text-gray-200 [&:has([role=checkbox])]:pr-0",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</td>