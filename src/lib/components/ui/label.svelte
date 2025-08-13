<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	let {
		className = '',
		onclick,
		children,
		...restProps
	}: HTMLLabelAttributes & {
		className?: string
		children?: any
	} = $props()

	const labelClass = $derived(cn(
		'flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
		className
	))
</script>

<label
	class={labelClass}
	{onclick}
	{...restProps}
>
	{@render children?.()}
</label>