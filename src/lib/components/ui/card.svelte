<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'
	import { cva, type VariantProps } from 'class-variance-authority'

	const cardVariants = cva(
		'relative overflow-hidden transition-all duration-300',
		{
			variants: {
				variant: {
					default: 'bg-slate-800 border border-slate-700 shadow-lg rounded-xl',
					solid: 'bg-slate-800 border border-slate-700 shadow-lg rounded-xl',
					glass: 'bg-slate-800/95 border border-slate-600 shadow-lg rounded-xl hover:bg-slate-700/95',
					gradient: 'bg-slate-800 border border-purple-700 shadow-lg rounded-xl',
					glow: 'bg-slate-800 border-2 border-slate-600 shadow-lg rounded-xl'
				},
				padding: {
					none: '',
					sm: 'p-4',
					md: 'p-6',
					lg: 'p-8',
					xl: 'p-10'
				}
			},
			defaultVariants: {
				variant: 'default',
				padding: 'md'
			}
		}
	)

	interface Props extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
		className?: string
		children?: any
		hasShimmer?: boolean
	}

	let {
		className = '',
		variant,
		padding,
		hasShimmer = false,
		children,
		...restProps
	}: Props = $props()

	const cardClass = $derived(cn(cardVariants({ variant, padding }), className))
</script>

<div
	class={cardClass}
	{...restProps}
>
	{#if hasShimmer}
		<div class="absolute inset-0 bg-gradient-shine opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
	{/if}
	{@render children?.()}
</div>