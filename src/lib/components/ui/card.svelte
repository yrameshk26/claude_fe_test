<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'
	import { cva, type VariantProps } from 'class-variance-authority'

	const cardVariants = cva(
		'relative overflow-hidden transition-all duration-300',
		{
			variants: {
				variant: {
					default: 'bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl',
					solid: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl',
					glass: 'bg-white/5 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl hover:bg-white/10',
					gradient: 'bg-gradient-to-br from-primary/20 via-accent/10 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl',
					glow: 'bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20 rounded-2xl'
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