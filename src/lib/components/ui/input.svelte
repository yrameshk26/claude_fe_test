<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	let {
		value = $bindable(''),
		className = '',
		type = 'text',
		oninput,
		onchange,
		onfocus,
		onblur,
		onkeydown,
		onkeyup,
		onkeypress,
		...restProps
	}: HTMLInputAttributes & {
		value?: string | number | null
		className?: string
	} = $props()

	const inputClass = $derived(cn(
		'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
		'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
		'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
		className
	))
</script>

<input
	{type}
	bind:value
	class={inputClass}
	{oninput}
	{onchange}
	{onfocus}
	{onblur}
	{onkeydown}
	{onkeyup}
	{onkeypress}
	{...restProps}
/>