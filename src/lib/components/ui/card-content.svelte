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

	const contentClass = $derived(cn('px-6', className))
</script>

<div
	class={contentClass}
	{...restProps}
>
	{@render children?.()}
</div>