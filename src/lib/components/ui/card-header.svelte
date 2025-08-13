<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	let {
		className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		className?: string
		children?: any
	} = $props()

	const headerClass = $derived(cn(
		'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6',
		className
	))
</script>

<div
	class={headerClass}
	{...restProps}
>
	{@render children?.()}
</div>