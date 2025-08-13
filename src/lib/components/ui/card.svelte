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

	const cardClass = $derived(cn(
		'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
		className
	))
</script>

<div
	class={cardClass}
	{...restProps}
>
	{@render children?.()}
</div>