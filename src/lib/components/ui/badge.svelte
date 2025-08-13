<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'
	import { cva, type VariantProps } from 'class-variance-authority'

	const badgeVariants = cva(
		'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all',
		{
			variants: {
				variant: {
					default: 'bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-white/20 text-white',
					success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 text-green-300',
					warning: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-300',
					error: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 text-red-300',
					info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300',
					glow: 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/50'
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	)

	interface Props extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
		className?: string
		children?: any
	}

	let {
		className = '',
		variant,
		children,
		...restProps
	}: Props = $props()
</script>

<span
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</span>