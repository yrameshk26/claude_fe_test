<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	let {
		className = '',
		tag = 'h3',
		children,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> & {
		className?: string
		tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
		children?: any
	} = $props()

	const titleClass = $derived(cn('leading-none font-semibold', className))
</script>

{#if tag === 'h1'}
	<h1 class={titleClass} {...restProps}>{@render children?.()}</h1>
{:else if tag === 'h2'}
	<h2 class={titleClass} {...restProps}>{@render children?.()}</h2>
{:else if tag === 'h3'}
	<h3 class={titleClass} {...restProps}>{@render children?.()}</h3>
{:else if tag === 'h4'}
	<h4 class={titleClass} {...restProps}>{@render children?.()}</h4>
{:else if tag === 'h5'}
	<h5 class={titleClass} {...restProps}>{@render children?.()}</h5>
{:else if tag === 'h6'}
	<h6 class={titleClass} {...restProps}>{@render children?.()}</h6>
{/if}