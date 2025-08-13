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

<thead
	class={cn(
		"[&_tr]:border-b border-white/10",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</thead>