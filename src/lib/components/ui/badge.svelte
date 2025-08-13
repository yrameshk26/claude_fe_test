<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'
	import { cva, type VariantProps } from 'class-variance-authority'

	const badgeVariants = cva(
		'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all',
		{
			variants: {
				variant: {
					default: 'bg-slate-800/80 text-slate-300 border-slate-700',
					success: 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50',
					warning: 'bg-amber-950/50 text-amber-400 border-amber-900/50',
					error: 'bg-red-950/50 text-red-400 border-red-900/50',
					info: 'bg-blue-950/50 text-blue-400 border-blue-900/50',
					glow: 'bg-slate-800/80 text-slate-300 border-slate-700'
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